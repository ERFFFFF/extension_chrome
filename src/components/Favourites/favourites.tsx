import React, { useState } from "react"
import axios from 'axios';

export const Favourites = (props: { watchers: any, setWatchers: any }) => {
  const { watchers, setWatchers } = props;

  const [streamerName, setStreamerName] = useState("")


  const handleChange = (e: any) => {
    setStreamerName(e.target.value)
  }

  const onClick = () => {
    axios.get("https://chaturbate.com/api/panel_context/" + streamerName)
      .then(function (response) {
        if (response.status == 200) {
          setWatchers([...watchers, streamerName], async () => {
            // je sais pas pk sa marche pas
            chrome.runtime.sendMessage({ type: "GET_WATCHERS", watchers: watchers })
            chrome.runtime.sendMessage({ type: "GET_JSP" })
          })
          chrome.notifications.create(
            {
              type: "basic",
              title: "Your streamer is now added to the list.",
              message: `${streamerName} is added to the watcher list !`,
              iconUrl: "./icon16.png"
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