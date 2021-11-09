// cette file est éxécuté de base lorsquon raffraichis notre extension
// ce fichier est le js global à notre application.
// This file is ran as a background script
//console.log("Hello from background script!")

import axios from 'axios';
import { MessageType } from "./types";

// pour que sa marche, (npm start + ctrl s + refresh button sur la page des extensions)
// chrome.tabs.onActivated.addListener(tab => {
//   console.log(tab)
// })
/*

chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "GET_STATUS":
      // listen to every tabs the users is moving into
      chrome.tabs.onActivated.addListener(currentTab => {
        // get the information of a tab by specifying a tabId
        chrome.tabs.get(currentTab.tabId, currentTabInfo => {
          // check if the current tab is undefined or not
          if(currentTabInfo.url != undefined) {
            console.log(currentTabInfo.url)
            // check if the current page is equal the the page that we want.
            if(/^https:\/\/www\.google/.test(currentTabInfo.url)) {
              // execute the foreground/content.ts script in the active tab.
              chrome.tabs.executeScript({file: './content.tsx'}, () => { console.log("Executing Script...")})
            }
          }
        })
      })
      break;
    default:
      break;
  }
});

chrome.tabs.onUpdated.addListener(function _(tabId, changeInfo, tab) {
  if(tab.url != undefined) {
    if(/^chrome:\/\/newtab/.test(tab.url)) {
      // remove listenner events (bugs if accumulation of listenners)
      // TO DO in onActivated
      chrome.tabs.onUpdated.removeListener(_);
      console.log("Hello there !")
      // cannot execute script in a newtab
      chrome.tabs.executeScript({file: './content.tsx'}, () => { console.log("Executing Script...")})
    }
  }
});
*/

/* ADBLOCKING */

// https://blocklistproject.github.io/Lists/

// import defaultFilters from "./list";

// chrome.webRequest.onBeforeRequest.addListener(() => {
//   return { cancel: true }
// }, { urls: defaultFilters }, ["blocking"])

// chrome.notifications.create(
//   {
//     type: "basic",
//     title: "test",
//     message: "je suis un test",
//     iconUrl: "./components/Favourites/icon16.png"
//   }
// )
// chrome.notifications.onClicked.addListener(onClick)

//setInterval(() => console.log("saloppe"), 3000)
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
            console.log("al frr")
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