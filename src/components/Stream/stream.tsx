import React, { useState } from "react"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'

// Environment variables
const env = {
  URL_STREAM: process.env.REACT_APP_URL_STREAM || 'https://chaturbate.com/'
};

export const Stream = () => {

  const [streamerName, setStreamerName] = useState("")

  const handleChange = (e: any) => {
    setStreamerName(e.target.value)
  }

  const onClick = async () => {
    if (!streamerName.trim()) {
      chrome.notifications.create(
        {
          type: "basic",
          title: "Error",
          message: "Please enter a streamer name",
          iconUrl: "./bonk.png"
        }
      );
      return;
    }

    // Directly add the streamer without checking if they exist
    chrome.runtime.sendMessage({ type: "ADD_WATCHER", watcher: streamerName.trim() }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Error sending message:", chrome.runtime.lastError.message);
      }
    });
    
    chrome.notifications.create(
      {
        type: "basic",
        title: "Success!",
        message: `${streamerName.trim()} is added to the watcher list!`,
        iconUrl: "./bonk.png"
      }
    );
    
    setStreamerName(""); // Clear the input field
  };
  return (
    <>
      <div className="buttonContainer" style={{ color: 'red' }}>
        <TextField id="standard-basic" label="Streamer name" variant="standard" placeholder="ex: madnessalise" value={streamerName} onChange={handleChange} />
        <Button variant="contained" color="success" size="small" onClick={onClick}>
          ADD
        </Button>
      </div >
    </>
  );
};