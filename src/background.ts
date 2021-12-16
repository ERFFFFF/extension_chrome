// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import { DirectionsOffSharp } from '@mui/icons-material';
import axios from 'axios';
import { MessageType } from "./types";
const env = require('/env.json');
var watchers: any = ""
// var watchers: any = env.watchers
chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "ADD_WATCHER":
      //watchers.push(message.watcher)
      chrome.storage.sync.set({ [message.watcher]: "true" }, function () {
        console.log('Watcher : ' + message.watcher + ' added !');
      });
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });
      break;
    case "DELETE_WATCHER":
      chrome.storage.sync.remove(message.watcher)
      console.log("removed watcher : " + message.watcher)
      break;
    case "GET_JSP":
      console.log("JSP frr")
      break;
    default:
      break;
  }
});

setInterval(() => {
  chrome.storage.sync.get(null, function (result) {
    //watchers = Object.keys(result)
    watchers = Array.from(JSON.stringify(result).replace('{', '').replace('}', ''));
    //watchers = Object(result).content;

    // it is shown as a string with commas, but it is in reality an array.
    console.log('Value of everything 1 is ' + watchers);
  });
  chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });

}, 1000)
// 1 sec = 1000ms

setInterval(() => {
  for (let index = 0; index < watchers.length; index++) {
    console.log(watchers.length)
    console.log(watchers[index])
    axios.get(env.URL_USER_CONNECTED + watchers[index])
      .then(function (response) {
        if (response.status == 200) {
          chrome.notifications.create(watchers[index],
            {
              type: "basic",
              title: "Shhhhhhhhhh",
              message: `${watchers[index]} is online !`,
              iconUrl: "./bonk.png",
            }
          )
          // if there is no event on the notif, create one
          if (!chrome.notifications.onClicked.hasListeners()) {
            chrome.notifications.onClicked.addListener(
              function redirect() {
                window.open(env.URL_STREAM + watchers[index])
              })
          }
          // delete the notification
          chrome.notifications.clear(watchers[index])
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
  // chrome.notifications.getAll((notifications) => {
  //   console.log(notifications)
  // })
}, 5000);
//600000
