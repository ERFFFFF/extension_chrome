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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import "./App.css";

// Environment variables
const env = {
  URL_STREAM: process.env.REACT_APP_URL_STREAM || 'https://chaturbate.com/'
};

const App = () => {
  const [render, setRender] = useState(true)
  const [watchers, setWatchers]: any = useState([])
  const [liveStatus, setLiveStatus]: any = useState({})
  const [monitoringStatus, setMonitoringStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Request initial data from background script
    chrome.runtime.sendMessage({ type: "GET_INITIAL_DATA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Error requesting initial data:", chrome.runtime.lastError.message);
      }
    });

    // Set up message listener for updates from background script
    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "REFRESH_UI_WATCHERS":
          setWatchers(message.watchers)
          if (message.monitoringStatus) {
            setMonitoringStatus(message.monitoringStatus);
          }
          break;
        case "UPDATE_LIVE_STATUS":
          setLiveStatus(message.liveStatus);
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

  const openStream = (streamerName: string) => {
    const streamUrl = env.URL_STREAM + streamerName;
    chrome.tabs.create({ url: streamUrl });
  }

  const toggleMonitoring = (streamerName: string, enabled: boolean) => {
    chrome.runtime.sendMessage({ 
      type: "TOGGLE_MONITORING", 
      watcher: streamerName, 
      enabled: enabled 
    });
    setMonitoringStatus(prev => ({
      ...prev,
      [streamerName]: enabled
    }));
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onClick} variant="contained" size="small">Watchers</Button>
      </header>
      <div className="App-body">
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
                    <ListItem 
                      key={`${element}`} 
                      secondaryAction={
                        <Box 
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          onClick={(e) => e.stopPropagation()} // Prevent any clicks in this area from bubbling
                        >
                          <Switch
                            edge="end"
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent event bubbling to parent ListItem
                              toggleMonitoring(element, e.target.checked);
                            }}
                            checked={monitoringStatus[element] !== false}
                            inputProps={{
                              'aria-labelledby': `switch-list-label-${element}`,
                            }}
                            size="small"
                          />
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={(e) => { 
                              e.stopPropagation(); // Prevent event bubbling to parent ListItem
                              deleteElement(element);
                            }} 
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                        }
                      }}
                      onClick={() => openStream(element)}
                    >
                      <Chip 
                        label={liveStatus[element] ? "LIVE" : "OFFLINE"}
                        color={liveStatus[element] ? "success" : "error"}
                        size="small"
                        sx={{ marginRight: 1, minWidth: 70 }}
                      />
                      <ListItemText 
                        primary={`${element}`}
                        sx={{ 
                          color: liveStatus[element] ? '#4caf50' : '#f44336',
                          fontWeight: liveStatus[element] ? 'bold' : 'normal'
                        }} 
                      />
                    </ListItem>
                  ))}
                </ul>
              </li>
            }
          </List>
        }
      </div>
      <footer>v1.0.0</footer>
    </div >
  );
};

export default App;
