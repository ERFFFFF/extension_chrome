import React, { useState, useEffect } from "react"
import { Favourites } from "./components/Favourites/favourites";
import "./App.css";

const App = () => {
  const [render, setRender] = useState(true)
  const [watchers, setWatchers]: any = useState([])

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
          <Favourites watchers={watchers} setWatchers={setWatchers}></Favourites>
        </>
          :
          <>
            {watchers.map((element: any) => (<p>{element}</p>))}
          </>
        }
      </body>
      <footer>v0.1</footer>
    </div>
  );
};

export default App;
