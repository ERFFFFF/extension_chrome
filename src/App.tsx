import React, { useState, useEffect } from "react"
import { Stream } from "./components/Stream/stream";
import { MessageType } from "./types";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';

import "./App.css";

const App = () => {
  const [render, setRender] = useState(true)
  const [watchers, setWatchers]: any = useState([])

  useEffect(() => {
    // update every miliseconds # to the backgound send the message
    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "REFRESH_UI_WATCHERS":
          setWatchers(message.watchers)
          break;
        case "GET_JSP":
          console.log("JSP frr")
          break;
        default:
          break;
      }
    });
  }, [])
  const onClick = () => {
    setRender(!render)
  };
  const deleteElement = (element: string) => {
    chrome.runtime.sendMessage({ type: "DELETE_WATCHER", watcher: element })
  }
  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onClick} variant="contained" size="small">Watchers</Button>
      </header>
      <body className="App-body">
        {render ? <>
          <p className="descr">
            This extension notify you when a streamer is online.
          </p>
          <p className="creator">Extension created by <a className="App-link" href="https://github.com/ERFFFFF">ERFFFFF</a>.</p>
          <p className="mention">App created thanks to the project of <a className="App-link" href="https://github.com/sivertschou/snow-extension">sivertschou</a></p>
          <Stream></Stream>
        </>
          :
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 }
            }}
            subheader={<li />}
          >
            {
              <li>
                <ul>
                  {watchers.map((element: any) => (
                    <ListItem key={`${element}`} secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => { deleteElement(element) }} color="error">
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={`${element}`} />
                      <Switch
                        disabled
                        edge="end"
                        //onChange={}
                        checked={true}
                        inputProps={{
                          'aria-labelledby': 'switch-list-label-wifi',
                        }}
                      />
                    </ListItem>
                  ))}
                </ul>
              </li>
            }
          </List>
        }
      </body>
      <footer>v0.2</footer>
    </div >
  );
};

export default App;
