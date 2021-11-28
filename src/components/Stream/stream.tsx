import React, { useState } from "react"
import axios from 'axios';
const env = require('/env.json');
export const Stream = () => {

  const [streamerName, setStreamerName] = useState("")

  const handleChange = (e: any) => {
    setStreamerName(e.target.value)
  }

  const onClick = () => {
    axios.get(env.URL_USER_EXIST + streamerName)
      .then(function (response) {
        if (response.status == 200) {
          chrome.runtime.sendMessage({ type: "ADD_WATCHER", watcher: streamerName })
          chrome.notifications.create(
            {
              type: "basic",
              title: "Your streamer is now added to the list.",
              message: `${streamerName} is added to the watcher list !`,
              iconUrl: "./bonk.png"
            }
          )
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };
  return (
    <>
      <div className="buttonContainer">
        <input type="text" placeholder="Streamer name..." value={streamerName} onChange={handleChange} />
        <button onClick={onClick}>Validate</button>
      </div >
    </>
  );
};