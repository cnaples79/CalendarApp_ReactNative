# AI Calendar Groovy App

A fully functional AI-powered calendar application built with Groovy and JavaFX that allows users to manage events through both manual interactions and natural language AI commands.

## Features

### Core Calendar Management
- **Monthly Grid View**: Navigate through months with previous/next buttons
- **Event Display**: View events directly in calendar cells with detailed information
- **Day Selection**: Click on any day to view detailed events for that date

### Manual Event Management (CRUD)
- **Create Events**: Add new events via "New Event" dialog with title, date/time, and description
- **View Events**: Click on calendar days to see all events for that date
- **Edit Events**: Modify existing events through dedicated edit dialogs
- **Delete Events**: Remove events with confirmation dialogs
- **Real-time Updates**: Calendar view automatically refreshes after any changes

### AI-Powered Event Management
- **Natural Language Commands**: Interact with your calendar using conversational AI
- **AI Event Creation**: Ask the AI to create events (e.g., "Schedule a meeting tomorrow at 2 PM")
- **AI Event Updates**: Modify existing events through AI commands (e.g., "Change the meeting time to 3 PM")
- **AI Event Deletion**: Remove events via AI (e.g., "Delete the doctor appointment on June 16th")
- **Intelligent Parsing**: AI responses are parsed for embedded ACTION commands even within conversational text

### User Interface
- **Chat Interface**: Dedicated chat window for AI interactions
- **Daily Timeline View**: Scrollable hourly view of events for a selected day, with tooltips for full event details.
- **Modern Design**: Clean, intuitive interface with proper dialog management
- **Event Details**: Rich event information display with titles, times, and descriptions

## Tech Stack
- **Groovy**: Primary programming language
- **JavaFX**: Desktop UI framework
- **Gradle**: Build and dependency management
- **Apache HttpClient**: HTTP communication for AI API calls
- **OpenRouter AI**: AI service integration (configurable)

## Project Structure

```
src/main/groovy/com/aicalendar/
├── App.groovy              # Main application entry point
├── CalendarService.groovy  # Core calendar data management
├── ChatWindow.groovy       # Main UI with calendar grid, chat, and timeline integration
├── DailyTimelineView.groovy # UI component for the daily timeline
├── AIService.groovy        # AI integration and command parsing
├── Event.groovy           # Event data model (POGO)
└── AIResponsePayload.groovy # AI response wrapper
```

## Configuration

Set these environment variables for AI functionality:
- `AI_CALENDAR_API_ENDPOINT`: AI service endpoint (defaults to OpenRouter)
- `AI_CALENDAR_API_KEY`: Your API key for the AI service

## AI Command Format

The AI uses specific action formats for event management:
- **Create**: `ACTION: CREATE_EVENT title="Event Title" startTime="YYYY-MM-DDTHH:MM" endTime="YYYY-MM-DDTHH:MM" description="Optional description"`
- **Update**: `ACTION: UPDATE_EVENT eventId="event-id" title="New Title" startTime="YYYY-MM-DDTHH:MM" endTime="YYYY-MM-DDTHH:MM" description="New description"`
- **Delete**: `ACTION: DELETE_EVENT eventId="event-id"`

## Running the Application

```bash
gradle run
```

## Key Features Implemented
- Full CRUD operations for calendar events
- AI-driven event management with natural language processing
- Monthly calendar grid view with navigation
- Real-time calendar updates after any modification
- Comprehensive error handling and user feedback
- Event validation and proper date/time formatting
- Embedded ACTION command parsing from conversational AI responses





Made with ❤️ from Charlotte.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
