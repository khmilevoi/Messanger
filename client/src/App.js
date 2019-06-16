import React from "react";
import Login from "./components/Login";

import "./styles/css/App.min.css";

import Chat from "./components/Chat/Chat";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Login />
        <Chat />
      </div>
    );
  }
}

export default App;
