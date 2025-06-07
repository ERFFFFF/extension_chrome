# Chrome Extension - Streamer Monitor

A Chrome extension for monitoring live streamers with real-time notifications and status tracking.

## Features

- 🔴 **Live Status Monitoring** - Tracks streamer live/offline status every 30 seconds
- 🔔 **Smart Notifications** - Alerts when streamers go live + hourly reminders
- ⚡ **Individual Controls** - Enable/disable monitoring per streamer
- 🎯 **Quick Access** - Click streamer names to open streams
- 💾 **Persistent Storage** - Remembers your watcher list and settings

## Setup

### 0. Create a new project
```bash
$ npx degit https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate.git#christmas <project-name>
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# API endpoint to check if a streamer is live
REACT_APP_URL_USER_CONNECTED=https://jpeg.live.mmcdn.com/stream?room=

# Base URL for opening streams  
REACT_APP_URL_STREAM=https://chaturbate.com/

# Default watchers list (comma-separated, no spaces)
# Example: REACT_APP_DEFAULT_WATCHERS=streamer1,streamer2,streamer3
REACT_APP_DEFAULT_WATCHERS=
```

### 3. Build the Extension
```bash
npm run build
```

### 4. Load in Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist` directory from this project

## Usage

### Adding Streamers
- Type a streamer name in the input field
- Click **Add** to add them to your watch list
- New streamers are monitored by default

### Managing Streamers
- **Toggle monitoring** - Click the switch to enable/disable monitoring
- **Delete streamers** - Click the red delete button  
- **Open streams** - Click on streamer names

### Notifications
- **Live alerts** - Get notified when streamers go live
- **Hourly reminders** - Reminds you which streamers are currently live
- **Click notifications** - Opens streams directly

## Development

```bash
# Development build with file watching
npm start

# Production build
npm run build
```

## Security Notes

- The `.env` file contains sensitive configuration
- Never commit `.env` to version control
- Environment variables are prefixed with `REACT_APP_` for webpack access
