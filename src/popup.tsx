import * as React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./popup.css";

const mountNode = document.getElementById("popup");
if (mountNode) {
  createRoot(mountNode).render(<App />);
}
