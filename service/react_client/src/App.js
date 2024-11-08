import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    // /health 엔드포인트에 요청을 보냄
    axios
      .get("/health", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setStatus("Server is healthy!");
        }
      })
      .catch((error) => {
        console.error("Error checking health:", error);
        setStatus("Server is down");
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <h1>Server Health Check</h1>
          <p>Status: {status}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
