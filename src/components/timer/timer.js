import React, { Component } from "react";
import Clock from "../clock";

import "./styles.scss";

const runVals = {
  d: "default",
  s: "start",
  p: "pause",
  r: "repeat",
};

class Timer extends Component {
  constructor(props) {
    super(props);

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

  componentDidUpdate(prevProps, prevState) {
    const prevTryToRun = prevProps.tryToRun;
    const { tryToRun } = this.props;

    console.group("componentDidUpdate");
    console.log("prevProps", prevProps);
    console.log("props", this.props);
    console.log("prevState", prevState);
    console.log("state", this.state);
    console.groupEnd();

    if (
      tryToRun === runVals["s"] &&
      prevTryToRun !== runVals["s"] &&
      this.canStart()
    ) {
      this.start();
    } else if (
      tryToRun === runVals["p"] &&
      prevTryToRun !== runVals["p"] &&
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
    const { isRunning } = this.props;
    const secsToTick = this.transformTimeToSecs();

    return !isRunning && secsToTick && secsToTick > 0;
  }

  canPause() {
    const { isRunning } = this.props;
    const secsToTick = this.transformTimeToSecs();
    return isRunning && this.timerId && secsToTick && secsToTick > 0;
  }

  start() {
    console.log("start");
    if (!this.initTime) {
      const { hours, minutes, seconds } = this.state;
      this.initTime = { hours, minutes, seconds };
    }

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

  finish() {
    console.log("finish");
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.props.onFinish();

    this.repeatId = setInterval(() => this.prepareToRepeat(), 1000);
  }

  prepareToRepeat() {
    console.log("prepareToRepeat");
    if (this.initTime) {
      const { hours, minutes, seconds } = this.initTime;
      this.initTime = null;
      this.setState({ hours, minutes, seconds });
      if (this.repeatId) {
        clearInterval(this.repeatId);
      }
    }
    //this.props.onRepeatPrepared();
  }

  handleTimeChange(hours, minutes, seconds) {
    console.log("handleTimeChange");
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

    return { hours, minutes, seconds };
  }

  handleTick() {
    console.log("handleTick");
    let secsToTick = this.transformTimeToSecs() - 1;
    let { isRunning } = this.props;
    const { hours, minutes, seconds } = this.transformSecsToTime(secsToTick);

    this.setState({ hours, minutes, seconds });

    if (secsToTick <= 0 && isRunning) {
      this.finish();
    }
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
export { runVals };
