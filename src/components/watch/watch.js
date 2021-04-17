import React, { Component } from "react";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../models/timeTransform";
import Clock from "../clock";

class Watch extends Component {
  constructor(props) {
    super(props);

    const hours = props.hours ? props.hours : 0;
    const minutes = props.minutes ? props.minutes : 0;
    const seconds = props.seconds ? props.seconds : 0;

    this.state = {
      hours,
      minutes,
      seconds,
    };
  }

  // lifecycle
  componentDidMount() {
    if (this.props.isRunning) {
      this.watchId = setInterval(() => this.handleTick(), 1000);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isRunning && !prevProps.isRunning && !this.watchId) {
      this.watchId = setInterval(() => this.handleTick(), 1000);
    } else if (!this.props.isRunning && prevProps.isRunning && this.watchId) {
      const hours = this.props.hours ? this.props.hours : 0;
      const minutes = this.props.minutes ? this.props.minutes : 0;
      const seconds = this.props.seconds ? this.props.seconds : 0;
      this.setState({
        hours,
        minutes,
        seconds,
      });
      clearInterval(this.watchId);
    }
  }

  componentWillUnmount() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
  }

  // event handlers
  handleTick() {
    let secs = this.callTransformTimeToSecs() + 1;
    const { hours, minutes, seconds } = transformSecsToTime(secs);

    this.setState({ hours, minutes, seconds });

    if (this.props.notifyAfterSecs) {
      if (secs % this.props.notifyAfterSecs === 0) {
        this.showNotification();
      }
    }
  }

  handleTimeChange(hours, minutes, seconds) {
    this.setState({
      hours,
      minutes,
      seconds,
    });
  }

  // methods
  callTransformTimeToSecs() {
    const { hours, minutes, seconds } = this.state;
    return transformTimeToSecs(hours, minutes, seconds);
  }

  showNotification() {
    const { hours, minutes, seconds } = this.state;
    const options = {
      body: `Таймер прозвенел ${hours}ч. ${minutes}м. ${seconds}с. назад`,
      dir: "ltr",
    };
    new Notification("Таймер", options);
  }

  render() {
    return (
      <Clock
        readOnly={true}
        hours={this.state.hours}
        minutes={this.state.minutes}
        seconds={this.state.seconds}
      />
    );
  }
}

export default Watch;
