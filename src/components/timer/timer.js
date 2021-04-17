import React, { Component } from "react";
import Clock from "../clock";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../models/timeTransform";

import "./styles.scss";
import { Button } from "react-bootstrap";

const statuses = {
  s: "stopped",
  r: "running",
  p: "paused",
  f: "finished",
};
class Timer extends Component {
  constructor(props) {
    super(props);

    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleStartBtn = this.handleStartBtn.bind(this);
    this.handlePauseBtn = this.handlePauseBtn.bind(this);
    this.handleStopBtn = this.handleStopBtn.bind(this);

    const hours = props.hours ? props.hours : 0;
    const minutes = props.minutes ? props.minutes : 0;
    const seconds = props.seconds ? props.seconds : 0;

    this.state = {
      hours,
      minutes,
      seconds,
      status: statuses["s"],
    };
  }

  // lifecycle
  componentDidMount() {
    if (!("Notification" in window)) {
      console.log("notifications disabled");
    } else {
      Notification.requestPermission();
    }
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // event listeners
  handleTimeChange(hours, minutes, seconds) {
    this.setState({
      hours,
      minutes,
      seconds,
    });
  }

  handleStartBtn() {
    if (!this.canStart()) {
      return;
    }

    if (!this.initTime) {
      const { hours, minutes, seconds } = this.state;
      this.initTime = { hours, minutes, seconds };
    }

    this.setState({ status: statuses["r"] });
    this.timerId = setInterval(() => this.handleTick(), 1000);
  }

  handlePauseBtn() {
    if (this.state.status !== statuses["r"]) {
      return;
    }
    if (this.timerId) {
      clearInterval(this.timerId);
      this.setState({ status: statuses["p"] });
    }
  }

  handleStopBtn() {
    if (this.state.status !== statuses["p"]) {
      return;
    }
    if (this.timerId) {
      clearInterval(this.timerId);

      this.setState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: statuses["p"],
      });

      this.repeatId = setTimeout(() => {
        this.setRepeat();
      }, 300);
    }
  }

  handleTick() {
    console.log("handleTick", this);
    let secsToTick = this.callTransformTimeToSecs() - 1;
    const { hours, minutes, seconds } = transformSecsToTime(secsToTick);

    this.setState({ hours, minutes, seconds });

    if (secsToTick <= 0) {
      this.finish();
    }
  }

  // methods
  callTransformTimeToSecs() {
    const { hours, minutes, seconds } = this.state;
    return transformTimeToSecs(hours, minutes, seconds);
  }

  canStart() {
    const secsToTick = this.callTransformTimeToSecs();

    return this.state.status !== statuses["r"] && secsToTick && secsToTick > 0;
  }

  finish() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.showNotification();
    this.setState({ status: statuses["f"] });

    this.repeatId = setTimeout(() => {
      this.setRepeat();
    }, 300);
  }

  setRepeat() {
    if (this.initTime) {
      const { hours, minutes, seconds } = this.initTime;
      this.initTime = null;

      this.setState({
        hours,
        minutes,
        seconds,
      });
    }
  }

  showNotification() {
    const options = {
      body: "Звенит таймер",
      dir: "ltr",
    };
    new Notification("Таймер", options);
  }

  render() {
    const { status, hours, minutes, seconds } = this.state;
    const readOnly = status !== statuses["s"] && status !== statuses["f"];

    // !
    const buttons = () => {
      switch (status) {
        case statuses["s"]:
        case statuses["f"]:
          return (
            <div className="buttons-wrapper">
              <Button onClick={this.handleStartBtn}>Start</Button>
            </div>
          );
        case statuses["r"]:
          return (
            <div className="buttons-wrapper">
              <Button onClick={this.handlePauseBtn}>Pause</Button>
            </div>
          );
        case statuses["p"]:
          return (
            <div className="buttons-wrapper">
              <Button onClick={this.handleStartBtn}>Start</Button>
              <Button onClick={this.handleStopBtn}>Stop</Button>
            </div>
          );
        default:
          return <div className="buttons-wrapper"></div>;
      }
    };

    return (
      <div className="timer">
        <Clock
          readOnly={readOnly}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onTimeChange={this.handleTimeChange}
        />
        {buttons()}
      </div>
    );
  }
}

export default Timer;
