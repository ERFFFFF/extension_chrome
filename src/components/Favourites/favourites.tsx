import React, { useState, useEffect } from "react"
import axios from 'axios';
import { Toast } from '../toast/Toast';

export const Favourites = () => {
  //const [snowing, setSnowing] = React.useState(true);

  // const onClick = () => {
  //   chrome.runtime.sendMessage({ type: "GET_STATUS" });
  // };

  const [streamerName, setStreamerName] = useState("")
  const [isUp, setIsUp] = useState("")
  const [listToast, setListToast]: any = useState([]);

  useEffect(() => {
    chrome.notifications.create(
      {
        type: "basic",
        title: "test",
        message: "je suis un test",
        iconUrl: "./icon16.png"
      }
    )
    chrome.notifications.onClicked.addListener(onClick)
  });

  const handleChange = (e: any) => {
    setStreamerName(e.target.value)
  }
  const onClick = () => {
    console.log("so6");
    axios.get("https://chaturbate.com/api/panel_context/" + streamerName)
      .then(function (response) {
        console.log(response);
        if (response.data.detail == "No app running" && response.status == 200) {
          console.log("offline")
          setIsUp('offline')

        } else {
          console.log("online");
          setIsUp('online')
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      }).then(() => {

        setListToast([
          ...listToast,
          {
            title: isUp,
            description: `The streamer ${streamerName} is ${isUp}`,
            backgroundColor: isUp == 'online' ? '#2820bf' : '#d9534f',
          },
        ]);
      })
  };
  const onClick2 = () => {
    chrome.notifications.create(
      {
        type: "basic",
        title: "test",
        message: "je suis un test",
        iconUrl: "./icon16.png"
      }
    )
  }

  return (
    <>
      <div className="buttonContainer">
        <input type="text" placeholder="Streamer name..." value={streamerName} onChange={handleChange} />
        <button onClick={onClick}>Validate</button>
        <button onClick={onClick2}>Validate2</button>
        <Toast
          toastList={listToast}
          position='top-right'
          autoDelete={true}
          dismissTime={2000}
        />

      </div >

    </>
  );
};