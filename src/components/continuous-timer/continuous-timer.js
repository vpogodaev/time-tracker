import React, { Component } from "react";
import { Button } from "react-bootstrap";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../models/timeTransform";
import Clock from "../clock";
import Watch from "../watch/watch";

import "./styles.scss";

const statuses = {
  s: "stopped",
  r: "running",
  p: "paused",
  o: "over",
  f: "finished",
};
class ContinuousTimer extends Component {
  constructor(props) {
    super(props);

    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleOverTimeChange = this.handleOverTimeChange.bind(this);
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
      hoursOver: 0,
      minutesOver: 0,
      secondsOver: 0,
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

  // event handlers
  handleTimeChange(hours, minutes, seconds) {
    this.setState({
      hours,
      minutes,
      seconds,
    });
  }

  handleOverTimeChange(hoursOver, minutesOver, secondsOver) {
    this.setState({
      hoursOver,
      minutesOver,
      secondsOver,
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
    if (
      this.state.status !== statuses["p"] &&
      this.state.status !== statuses["o"]
    ) {
      return;
    }
    if (this.timerId) {
      clearInterval(this.timerId);

      this.setState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: statuses["s"],
      });

      this.repeatId = setTimeout(() => {
        this.setRepeat();
      }, 300);
    }
  }

  handleTick() {
    //console.log("handleTick", this);
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

    const notifyAfterSecs = transformTimeToSecs(
      this.state.hoursOver,
      this.state.minutesOver,
      this.state.secondsOver
    );

    if (!notifyAfterSecs) {
      this.setState({ status: statuses["f"] });

      this.repeatId = setTimeout(() => {
        this.setRepeat();
      }, 300);
    } else {
      this.setState({ status: statuses["o"] });
    }
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
    const { hoursOver, minutesOver, secondsOver } = this.state;
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
        case statuses["o"]:
          return (
            <div className="buttons-wrapper">
              <Button onClick={this.handleStopBtn}>Stop</Button>
            </div>
          );
        default:
          return <div className="buttons-wrapper"></div>;
      }
    };

    const notifyAfterSecs = transformTimeToSecs(
      hoursOver,
      minutesOver,
      secondsOver
    );

    return (
      <div className="timer">
        Таймер:
        <Clock
          readOnly={readOnly}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onTimeChange={this.handleTimeChange}
        />
        <p>Просроченное время</p>
        Оповещать через:
        <Clock
          readOnly={readOnly}
          hours={hoursOver}
          minutes={minutesOver}
          seconds={secondsOver}
          onTimeChange={this.handleOverTimeChange}
        />
        Текущее время просрочки:
        <Watch
          isRunning={status === statuses["o"] && notifyAfterSecs}
          notifyAfterSecs={notifyAfterSecs}
        />
        {buttons()}
      </div>
    );
  }
}

export default ContinuousTimer;
