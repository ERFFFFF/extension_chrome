// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import axios from 'axios';
import { MessageType } from "./types";

var watchers: any = []
chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "GET_WATCHERS":
      console.log("watchers => ", message.watchers)
      watchers = message.watchers
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
    axios.get("https://chaturbate.com/api/panel_context/" + watchers[index])
      .then(function (response) {
        if (response.status == 200) {
          if (response.data.detail != "No app running") {
            chrome.notifications.create(
              {
                type: "basic",
                title: "Your streamer is now online.",
                message: `${watchers[index]} is online !`,
                iconUrl: "./icon16.png"
              }
            )
          }
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
}, 5000);