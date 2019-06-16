import React, { Component } from "react";
import "../../styles/css/Logo.min.css";

import { config } from "../Socket";

class Logo extends Component {
  render() {
    if (this.props.src === null) {
      const name = this.props.name
        .split(" ")
        .map(val => val[0])
        .join("");

      return (
        <div
          className={
            "logo logo-missing " +
            (this.props.className ? this.props.className : "")
          }
        >
          {name.toUpperCase()}
        </div>
      );
    }

    return (
      <img
        className={"logo " + (this.props.className ? this.props.className : "")}
        src={`http://${config.host}:${config.port}/Files/${this.props.src}`}
        alt={this.props.src}
      />
    );
  }
}

export default Logo;
