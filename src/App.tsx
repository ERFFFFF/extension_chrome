import * as React from "react";
import logo from "./logo.svg";
import { Favourites } from "./components/Favourites/favourites";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This extension will block ads.
        </p>
        <p className="creator">Extension created by <a className="App-link" href="https://github.com/ERFFFFF">ERFFFFF</a>.</p>
        <p className="mention">App created thanks to the project of <a className="App-link" href="https://github.com/sivertschou/snow-extension">sivertschou</a></p>
      </header>
      <body className="App-body">
        <Favourites></Favourites>
      </body>
    </div>
  );
};

export default App;
