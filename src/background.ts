// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import axios from 'axios';
import { MessageType } from "./types";
const env = require('/env.json');
var watchers: any = {}
chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "ADD_WATCHER":
      //watchers.push(message.watcher)
      chrome.storage.sync.set({ [message.watcher]: true }, function () {
        console.log('Watcher : ' + message.watcher + ' added !');
      });
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });
      break;
    case "DELETE_WATCHER":
      chrome.storage.sync.remove(message.watcher)
      console.log("removed watcher : " + message.watcher)
      break;
    default:
      break;
  }
});

// Refresh streamers
setInterval(() => {
  chrome.storage.sync.get(null, function (result) {
    watchers = result;
    chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });
  });
}, 500)
// 1 sec = 1000ms

// Send notification of streamers.
setInterval(() => {
  for (const [key, value] of Object.entries(watchers)) {
    console.log(value);
    if (value) {
      axios.get(env.URL_USER_CONNECTED + key)
        .then(function (response: any) {
          if (response.status == 200) {
            chrome.notifications.create(key,
              {
                type: "basic",
                title: "Shhhhhhhhhh",
                message: `${key} is online !`,
                iconUrl: "./bonk.png",
              }
            )
            // if there is no event on the notif, create one
            if (!chrome.notifications.onClicked.hasListeners()) {
              chrome.notifications.onClicked.addListener(
                function redirect() {
                  window.open(env.URL_STREAM + key)
                })
            }
            // delete the notification
            chrome.notifications.clear(key)
          }
        })
        .catch(function (error: any) {
          // handle error
          console.log(error);
        })
    }
  }
  // chrome.notifications.getAll((notifications) => {
  //   console.log(notifications)
  // })
}, 1000);
//600000
