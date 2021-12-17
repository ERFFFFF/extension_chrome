import React, { useState } from "react"
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const env = require('/env.json');
export const Stream = () => {

  const [streamerName, setStreamerName] = useState("")
  const [colored, setColored]: any = useState("primary")

  const handleChange = (e: any) => {
    if (colored != "primary") {
      setColored('primary')
    }
    setStreamerName(e.target.value)
  }

  const onClick = () => {
    axios.get(env.URL_USER_EXIST + streamerName)
      .then(function (response) {
        if (response.status == 200) {
          setColored("success")
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
        // ERROR 404
        setColored("error")
      })
  };
  return (
    <>
      <div className="buttonContainer">
        <TextField
          error={colored == "error" ? true : false}
          focused
          required
          color={colored}
          helperText={colored == "error" ? "User does not exists." : ""}
          id="standard-basic"
          label="Streamer name"
          variant="standard"
          placeholder="ex: madnessalise"
          value={streamerName}
          onChange={handleChange}
          sx={{
            width: "100%",
            position: "relative",
            overflow: "auto",
            marginBottom: '1%'
          }} />
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={onClick}
          sx={{
            width: "100%",
            maxWidth: 360,
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
          }}>
          ADD
        </Button>
      </div >
    </>
  );
};