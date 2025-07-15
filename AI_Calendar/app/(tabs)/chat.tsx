import React, { useState } from 'react';
import AIService from '../../services/AIService';
import ActionParser from '../../services/ActionParser';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
    if (inputText.trim() === '' || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
            const aiResponseText = await AIService.getAIResponse(inputText);
      let responseText = aiResponseText;

      const action = ActionParser.parse(aiResponseText);
      if (action) {
        responseText = await ActionParser.execute(action);
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: responseText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, something went wrong.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, styles[`${item.sender}Message`]]}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your command..."
        />
                <Button title={isSending ? 'Sending...' : 'Send'} onPress={handleSend} disabled={isSending} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#d1e7ff',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f8f9fa',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
