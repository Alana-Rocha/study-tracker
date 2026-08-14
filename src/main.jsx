import React from "react";
import ReactDOM from "react-dom/client";
import "./storage-polyfill.js";
import StudyTracker from "../transpetro-study-tracker.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StudyTracker />
  </React.StrictMode>
);
