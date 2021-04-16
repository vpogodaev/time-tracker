import React, { Component } from "react";
import Clock from "../clock";

import "./styles.scss";

const tryToRunVals = {
  d: "default",
  s: "start",
  p: "pause",
};

class Timer extends Component {
  constructor(props) {
    super(props);

    // this.handleStart = this.handleStart.bind(this);
    // this.handlePause = this.handlePause.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      //isRunning: false,
    };
  }

  // componentDidMount() {
  //   if (!("Notification" in window)) {
  //     console.log("notifications disabled");
  //   } else {
  //     Notification.requestPermission();
  //   }
  // }

  componentDidUpdate(prevProps) {
    const prevTryToRun = prevProps.tryToRun;
    const { tryToRun } = this.props;

    console.group("componentDidUpdate");
    console.log("prevTryToRun", prevTryToRun);
    console.log("tryToRun", tryToRun);
    console.groupEnd();

    if (
      tryToRun === tryToRunVals["s"] &&
      prevTryToRun !== tryToRunVals["s"] &&
      this.canStart()
    ) {
      this.start();
    } else if (
      tryToRun === tryToRunVals["p"] &&
      prevTryToRun !== tryToRunVals["p"] &&
      this.canPause()
    ) {
      this.pause();
    }
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // showNotification() {
  //   const options = {
  //     body: "Звенит таймер",
  //     dir: "ltr",
  //   };
  //   new Notification("Таймер", options);
  // }

  canStart() {
    console.log("canStart");
    const { isRunning } = this.props;
    const secsToTick = this.transformTimeToSecs();
    return !isRunning && secsToTick && secsToTick > 0;
  }

  canPause() {
    console.log("canPause");
    const { isRunning } = this.props;
    const secsToTick = this.transformTimeToSecs();
    return isRunning && this.timerId && secsToTick && secsToTick > 0;
  }

  start() {
    console.log("start");
    this.timerId = setInterval(() => this.handleTick(), 1000);
    this.props.onStart();
  }

  pause() {
    console.log("pause");
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.props.onPause();
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
    let { isRunning } = this.props;
    const { hours, minutes, seconds } = this.transformSecsToTime(secsToTick);
    if (secsToTick < 1 && isRunning) {
      clearInterval(this.timerId);
      this.pause();
      //this.showNotification();
    }

    this.setState({ hours, minutes, seconds });
  }

  render() {
    return (
      <div className="timer">
        <Clock
          readOnly={this.props.isRunning}
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          onTimeChange={this.handleTimeChange}
        />
      </div>
    );
  }
}

export default Timer;
export { tryToRunVals };
