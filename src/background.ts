// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import { MessageType } from "./types";

// Environment variables
const env = {
  URL_USER_CONNECTED: process.env.REACT_APP_URL_USER_CONNECTED || 'https://jpeg.live.mmcdn.com/stream?room=',
  URL_STREAM: process.env.REACT_APP_URL_STREAM || 'https://chaturbate.com/',
  watchers: process.env.REACT_APP_DEFAULT_WATCHERS ? process.env.REACT_APP_DEFAULT_WATCHERS.split(',').filter(w => w.trim()) : []
};

let watchers: string[] = [];
let monitoringStatus: {[key: string]: boolean} = {};
let liveStatus: {[key: string]: boolean} = {};

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension startup detected');
  initializeExtension();
});

// Handle extension installation/restart
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/restarted');
  initializeExtension();
});

// Initialize function
const initializeExtension = async () => {
  console.log('Initializing extension...');
  
  // Load data from storage first
  chrome.storage.sync.get(null, function (result) {
    const storedWatchers = Object.keys(result).filter(key => !key.startsWith('monitoring_'));
    const storedMonitoring = Object.keys(result)
      .filter(key => key.startsWith('monitoring_'))
      .reduce((acc, key) => {
        const watcherName = key.replace('monitoring_', '');
        acc[watcherName] = result[key];
        return acc;
      }, {} as any);

    if (storedWatchers.length > 0) {
      watchers = storedWatchers;
      monitoringStatus = storedMonitoring;
      console.log('Loaded stored watchers:', watchers);
    } else {
      // Use default watchers if no stored ones
      watchers = env.watchers || [];
      env.watchers?.forEach((watcher: string) => {
        chrome.storage.sync.set({ [watcher]: watcher });
        chrome.storage.sync.set({ [`monitoring_${watcher}`]: true });
        monitoringStatus[watcher] = true;
      });
      console.log('Using default watchers from .env:', watchers);
    }
    
    // Check live status immediately after loading watchers
    setTimeout(() => {
      console.log('Running initial live status check...');
      checkLiveStatus();
    }, 1000);
  });
  
  // Set up alarm for reliable periodic checks
  chrome.alarms.create('liveStatusCheck', { periodInMinutes: 0.5 }); // 30 seconds
  
  // Set up hourly reminder for live streamers
  chrome.alarms.create('hourlyReminder', { periodInMinutes: 60 }); // Every hour
  
};

// Function to check live status and update UI
const checkLiveStatus = async () => {
  console.log('Checking live status for watchers:', watchers);
  console.log('Monitoring status:', monitoringStatus);
  
  const newLiveStatus: {[key: string]: boolean} = {};
  
  // Check each watcher sequentially to avoid race conditions
  for (const watcher of watchers) {
    if (monitoringStatus[watcher]) {
      try {
        console.log(`Checking ${watcher} at:`, env.URL_USER_CONNECTED + watcher);
        
        const response = await fetch(env.URL_USER_CONNECTED + watcher, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        // Check specifically for 200 status
        const isLive = response.status === 200;
        newLiveStatus[watcher] = isLive;
        
        console.log(`${watcher} - Status: ${response.status}, Live: ${isLive}`);
        
        // Send notification only if streamer went from offline to online
        if (isLive && !liveStatus[watcher]) {
          console.log(`${watcher} went live! Sending notification.`);
          const iconUrl = chrome.runtime.getURL("bonk.png");
          console.log(`Notification icon URL: ${iconUrl}`);
          chrome.notifications.create(watcher, {
            type: "basic",
            title: "Streamer Alert!",
            message: `${watcher} is now online!`,
            iconUrl: iconUrl,
          });
          
          // Set up notification click handler
          if (!chrome.notifications.onClicked.hasListeners()) {
            chrome.notifications.onClicked.addListener(function redirect(notificationId) {
              if (notificationId === 'hourlyReminder') {
                // Open all live streamers in new tabs
                const liveStreamers = Object.keys(liveStatus).filter(streamer => liveStatus[streamer] && monitoringStatus[streamer]);
                liveStreamers.forEach(streamer => {
                  chrome.tabs.create({ url: env.URL_STREAM + streamer });
                });
              } else {
                // Regular streamer notification - open specific stream
                chrome.tabs.create({ url: env.URL_STREAM + notificationId });
              }
              chrome.notifications.clear(notificationId);
            });
          }
        }
      } catch (error) {
        console.log(`Error checking ${watcher}:`, error);
        newLiveStatus[watcher] = false;
      }
    } else {
      // Not being monitored, set to false
      newLiveStatus[watcher] = false;
    }
  }
  
  console.log('Previous live status:', liveStatus);
  console.log('New live status:', newLiveStatus);
  
  // Update live status
  liveStatus = newLiveStatus;
  
  // Send updated status to UI
  chrome.runtime.sendMessage({ 
    type: "UPDATE_LIVE_STATUS", 
    liveStatus: newLiveStatus 
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("No listener for live status update:", chrome.runtime.lastError.message);
    }
  });
};

chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "ADD_WATCHER":
      watchers.push(message.watcher)
      monitoringStatus[message.watcher] = true; // Enable monitoring by default for new watchers
      chrome.storage.sync.set({ [`monitoring_${message.watcher}`]: true });
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers, monitoringStatus: monitoringStatus }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("No listener for message:", chrome.runtime.lastError.message);
        }
      });
      chrome.storage.sync.set({ [message.watcher]: message.watcher }, function () {
        console.log('Watcher : ' + message.watcher + ' added !');
      });
      break;
    case "DELETE_WATCHER":
      chrome.storage.sync.remove(message.watcher)
      chrome.storage.sync.remove(`monitoring_${message.watcher}`)
      watchers = watchers.filter((w: string) => w !== message.watcher);
      delete monitoringStatus[message.watcher];
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers, monitoringStatus: monitoringStatus }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("No listener for message:", chrome.runtime.lastError.message);
        }
      });
      console.log("removed watcher : " + message.watcher)
      break;
    case "TOGGLE_MONITORING":
      monitoringStatus[message.watcher] = message.enabled;
      chrome.storage.sync.set({ [`monitoring_${message.watcher}`]: message.enabled });
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers, monitoringStatus: monitoringStatus }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("No listener for message:", chrome.runtime.lastError.message);
        }
      });
      console.log(`Monitoring ${message.enabled ? 'enabled' : 'disabled'} for ${message.watcher}`);
      break;
    case "GET_INITIAL_DATA":
      // Immediately send current data to UI when requested
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers, monitoringStatus: monitoringStatus }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("No listener for initial data:", chrome.runtime.lastError.message);
        }
      });
      // Also send current live status if available
      if (Object.keys(liveStatus).length > 0) {
        chrome.runtime.sendMessage({ type: "UPDATE_LIVE_STATUS", liveStatus: liveStatus }, (response) => {
          if (chrome.runtime.lastError) {
            console.log("No listener for live status:", chrome.runtime.lastError.message);
          }
        });
      }
      break;
    case "GET_JSP":
      console.log("JSP frr")
      break;
    default:
      break;
  }
});

// Function to send hourly reminder for live streamers
const sendHourlyReminder = () => {
  const liveStreamers = Object.keys(liveStatus).filter(streamer => liveStatus[streamer] && monitoringStatus[streamer]);
  
  if (liveStreamers.length > 0) {
    const message = liveStreamers.length === 1 
      ? `${liveStreamers[0]} is still live!`
      : `${liveStreamers.length} streamers are live: ${liveStreamers.join(', ')}`;
    
    chrome.notifications.create('hourlyReminder', {
      type: "basic",
      title: "Live Streamers Reminder",
      message: message,
      iconUrl: chrome.runtime.getURL("bonk.png"),
    });
    
    console.log('Sent hourly reminder for live streamers:', liveStreamers);
  } else {
    console.log('No live streamers for hourly reminder');
  }
};

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'liveStatusCheck') {
    console.log('Running scheduled live status check via alarm...');
    checkLiveStatus();
  } else if (alarm.name === 'hourlyReminder') {
    console.log('Running hourly reminder...');
    sendHourlyReminder();
  }
});

// Fallback: also use setInterval as backup
setInterval(() => {
  console.log('Running scheduled live status check via interval...');
  checkLiveStatus();
}, 30000); // Check every 30 seconds

// Refresh UI and sync with storage every 30 seconds instead of every second
setInterval(() => {
  chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers, monitoringStatus: monitoringStatus }, (response) => {
    if (chrome.runtime.lastError) {
      // Silent - no need to log this error every 30 seconds
    }
  });
  chrome.storage.sync.get(null, function (result) {
    const storedWatchers = Object.keys(result).filter(key => !key.startsWith('monitoring_'));
    const storedMonitoring = Object.keys(result)
      .filter(key => key.startsWith('monitoring_'))
      .reduce((acc, key) => {
        const watcherName = key.replace('monitoring_', '');
        acc[watcherName] = result[key];
        return acc;
      }, {} as any);
    watchers = storedWatchers;
    monitoringStatus = storedMonitoring;
    // Removed spam console log
  });
}, 30000); // Every 30 seconds instead of every 1 second