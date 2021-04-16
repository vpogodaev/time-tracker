import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Clock from "../clock";

import "./styles.scss";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      running: false,
    };
  }

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

  showNotification() {
    const options = {
      body: "Звенит таймер",
      dir: "ltr",
    };
    new Notification("Таймер", options);
  }

  handleStart() {
    const running = this.state.running;
    const secsToTick = this.transformTimeToSecs();
    if (running || !secsToTick || secsToTick < 1) {
      return;
    }

    this.setState({ running: true });
    this.timerId = setInterval(() => this.handleTick(), 1000);
  }

  handlePause() {
    const { running } = this.state;
    if (this.timerId && running) {
      clearInterval(this.timerId);
      this.setState({ running: false });
    }
  }

  handleTimeChange(hours, minutes, seconds) {
    this.setState({
      hours,
      minutes,
      seconds,
    });
  }

  transformTimeToSecs() {
    return (
      this.state.hours * 60 * 60 + this.state.minutes * 60 + this.state.seconds
    );
  }

  transformSecsToTime(secondsToTick) {
    let seconds = secondsToTick;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    console.log({ hours, minutes, seconds });

    return { hours, minutes, seconds };
  }

  handleTick() {
    let secsToTick = this.transformTimeToSecs() - 1;
    let running = this.state.running;
    const { hours, minutes, seconds } = this.transformSecsToTime(secsToTick);
    if (secsToTick < 1 && running) {
      clearInterval(this.timerId);
      running = false;
      this.showNotification();
    }

    this.setState({ running, hours, minutes, seconds });
  }

  render() {
    return (
      <div className="timer">
        <Clock
          readOnly={this.state.running}
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          onTimeChange={this.handleTimeChange}
        />
        <div className="buttons-wrapper">
          <Button onClick={this.handlePause}>Pause</Button>
          <Button onClick={this.handleStart}>Start</Button>
        </div>
      </div>
    );
  }
}

export default Timer;
