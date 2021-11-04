import React, { useState, useEffect } from "react"
import axios from 'axios';

export const Favourites = () => {
  //const [snowing, setSnowing] = React.useState(true);

  // const onClick = () => {
  //   chrome.runtime.sendMessage({ type: "GET_STATUS" });
  // };

  const [streamerName, setStreamerName] = useState("")
  const [watchers, setWatchers]: any = useState([])

  const handleChange = (e: any) => {
    setStreamerName(e.target.value)
  }
  useEffect(() => {
    let interval = setInterval(() => {
      chrome.notifications.create(
        {
          type: "basic",
          title: "Your streamer is now online.",
          message: `is online !`,
          iconUrl: "./icon16.png"
        }
      )
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
    // return () => clearInterval(interval);
  }, [watchers]);

  const onClick = () => {
    axios.get("https://chaturbate.com/api/panel_context/" + streamerName)
      .then(function (response) {
        if (response.status == 200) {
          setWatchers([...watchers, streamerName])
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