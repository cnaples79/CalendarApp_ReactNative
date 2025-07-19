import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import AIService from '../../services/AIService';
import ActionParser from '../../services/ActionParser';
import { Event } from '../../types/Event';

// The message content can be a string or an array of events for search results.
type Message = {
  role: 'user' | 'assistant';
  content: string | Event[];
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (inputText.trim() === '' || isSending) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
    };

    const currentInput = inputText;
    setInputText('');
    
    setMessages(prev => {
        const newMessages = [...prev, userMessage];
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        return newMessages;
    });

    setIsSending(true);

    try {
      const aiResponseText = await AIService.getAIResponse(currentInput);
      const action = ActionParser.parse(aiResponseText);

      let actionResult: string | Event[];
      if (action) {
        // The result could be a confirmation string or an array of events
        actionResult = await ActionParser.execute(action);
      } else {
        actionResult = aiResponseText; // No action found, just display the AI's text response
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: actionResult,
      };
      
      setMessages(prev => {
          const newMessages = [...prev, assistantMessage];
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          return newMessages;
      });

    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageContent = (item: Message) => {
    const isUser = item.role === 'user';
    const isEventList = Array.isArray(item.content);

    if (isEventList) {
      const events = item.content as Event[];
      if (events.length === 0) {
        return <Text style={styles.assistantMessageText}>I couldn't find any events matching that description.</Text>;
      }
      return (
        <View>
          <Text style={styles.assistantMessageText}>Here are the events I found:</Text>
          {events.map(event => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>
                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <Text style={isUser ? styles.userMessageText : styles.assistantMessageText}>
        {item.content as string}
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.role}-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.message, item.role === 'user' ? styles.user : styles.assistant]}>
            {renderMessageContent(item)}
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your command..."
          editable={!isSending}
        />
        {isSending ? (
          <ActivityIndicator style={styles.sendButton} />
        ) : (
          <Button title="Send" onPress={handleSend} disabled={!inputText.trim()} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 10,
  },
  message: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
    maxWidth: '85%',
  },
  user: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  assistant: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
  },
  assistantMessageText: {
    color: 'black',
    fontSize: 16,
  },
  eventItem: {
    marginTop: 8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  eventTime: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginHorizontal: 10,
  },
});
