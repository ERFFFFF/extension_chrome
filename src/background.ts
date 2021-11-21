// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import axios from 'axios';
import { MessageType } from "./types";
const env = require('/env.json');

var watchers: any = env.watchers
console.log("tqt => ", watchers)
chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "ADD_WATCHER":
      watchers.push(message.watcher)
      chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });
      break;
    case "GET_JSP":
      console.log("JSP frr")
      break;
    default:
      break;
  }
});

setInterval(() => {
  console.log("watchers numbers => ", watchers)
  for (let index = 0; index < watchers.length; index++) {
    console.log("watchers id => ", watchers[index])
    axios.get(env.URL_USER_CONNECTED + watchers[index])
      .then(function (response) {
        if (response.status == 200) {
          chrome.notifications.create(
            {
              type: "basic",
              title: "Shhhhhhhhhh",
              message: `${watchers[index]} is online !`,
              iconUrl: "./icon16.png"
            }
          )
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
}, 600000);

setInterval(() => {
  chrome.runtime.sendMessage({ type: "REFRESH_UI_WATCHERS", watchers: watchers });
}, 1)
// 1 sec = 1000