import React, { useState, useEffect } from "react"
import { Favourites } from "./components/Favourites/favourites";
import { MessageType } from "./types";
import "./App.css";

const App = () => {
  const [render, setRender] = useState(true)
  const [watchers, setWatchers]: any = useState([])

  useEffect(() => {
    // update every miliseconds # to the backgound send the message
    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "REFRESH_UI_WATCHERS":
          setWatchers([message.watchers])
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
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onClick}>Watchers</button>
      </header>
      <body className="App-body">
        {render ? <>
          <p className="descr">
            This extension notify you when a streamer is online.
          </p>
          <p className="creator">Extension created by <a className="App-link" href="https://github.com/ERFFFFF">ERFFFFF</a>.</p>
          <p className="mention">App created thanks to the project of <a className="App-link" href="https://github.com/sivertschou/snow-extension">sivertschou</a></p>
          <Favourites></Favourites>
        </>
          :
          <>
            <ul>
              {watchers.map((element: any) => { return (<li key={element}>{element}</li>) })}
              <li>watchers</li>
            </ul>
          </>
        }
      </body>
      <footer>v0.1</footer>
    </div>
  );
};

export default App;
