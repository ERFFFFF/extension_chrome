import React, { useState, useEffect } from "react"
import { Stream } from "./components/Stream/stream";
import { MessageType } from "./types";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
const env = {
  URL_STREAM: process.env.URL_STREAM as string,
};
import "./App.css";

const App = () => {
  const [render, setRender] = useState(true)
  const [watchers, setWatchers]: any = useState({})

  useEffect(() => {
    // update every miliseconds # to the backgound send the message
    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "REFRESH_UI_WATCHERS":
          setWatchers(message.watchers)
          break;
        default:
          break;
      }
    });
  }, [])
  const onClick = () => {
    setRender(!render)
  };
  const onChange = (key: any, index: any) => {
    // sync with the back but we got some latency so we set setWatchers to reduce it.
    chrome.storage.sync.set({ [key]: !Object.values(watchers)[index] });

    setWatchers({ ...watchers, [key]: !Object.values(watchers)[index] });
  };
  const deleteElement = (element: string) => {
    chrome.runtime.sendMessage({ type: "DELETE_WATCHER", watcher: element })
  }
  return (
    <div className="App">
      <header className="App-header">
        <Button
          onClick={onClick}
          variant="contained"
          size="small"
          sx={{
            width: "85%",
            position: "relative",
            overflow: "auto",
          }}
        >
          Watchers
        </Button>
      </header>
      <body className="App-body">
        {render ? <>
          <p className="descr">
            This extension notify when a streamer is online.
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
                  {
                    Object.keys(watchers).map((key, index) => (
                      <ListItem
                        key={`${key}`}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => { deleteElement(key) }} color="error">
                            <DeleteIcon />
                          </IconButton>
                        }
                        disablePadding>
                        <ListItemText
                          primary={`${key}`}
                          sx={{
                            width: "100%",
                            color: true ? "" : "#ff0000" // TODO : if streamer is online color in green, if not color in red
                          }}
                        />
                        <ListItemButton component="a" href={env.URL_STREAM + key} disabled={!Boolean(Object.values(watchers)[index])} sx={{
                          width: "75%",
                          marginLeft: "15%"
                        }}>
                          <ListItemText primary="Link" sx={{
                            color: "#0000ff",
                          }} />
                        </ListItemButton>
                        <Switch
                          // disabled
                          edge="end"
                          onChange={() => { onChange(key, index) }}
                          checked={Boolean(Object.values(watchers)[index])}
                          inputProps={{
                            'aria-labelledby': 'switch-list-label-wifi',
                          }}
                        />
                      </ListItem>
                    ))
                  }
                </ul>
              </li>
            }
          </List>
        }
      </body>
      <footer className='App-footer'><span>v0.5</span></footer>
    </div >
  );
};

export default App;
