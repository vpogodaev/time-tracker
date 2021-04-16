import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Clock from "../clock";
import Timer, { tryToRun } from "../timer";

import "./styles.scss";

class ContinuousTimer extends Component {
  constructor(props) {
    super(props);

    this.handleStartBtn = this.handleStartBtn.bind(this);
    this.handlePauseBtn = this.handlePauseBtn.bind(this);
    this.handleStartTimer = this.handleStartTimer.bind(this);
    this.handlePauseTimer = this.handlePauseTimer.bind(this);

    //console.log(tryToRun);
    this.state = {
      isTimerRunning: false,
      tryToRunTimer: tryToRun["d"],
    };
  }

  handleStartBtn() {
    console.log("handleStartBtn");
    const { isTimerRunning } = this.state;
    console.log("isTimerRunning", isTimerRunning);
    if (isTimerRunning) {
      return;
    }
    this.setState({ tryToRunTimer: tryToRun["s"] });
  }

  handlePauseBtn() {
    console.log("handlePauseBtn");
    const { isTimerRunning } = this.state;
    if (!isTimerRunning) {
      return;
    }
    this.setState({ tryToRunTimer: tryToRun["p"] });
  }

  handleStartTimer() {
    console.log("handleStartTimer");
    this.setState({ isTimerRunning: true, tryToRunTimer: tryToRun["d"] });
  }

  handlePauseTimer() {
    console.log("handlePauseTimer");
    this.setState({ isTimerRunning: false, tryToRunTimer: tryToRun["d"] });
  }

  render() {
    return (
      <>
        <div>
          <Timer
            isRunning={this.state.isTimerRunning}
            tryToRun={this.state.tryToRunTimer}
            onStart={this.handleStartTimer}
            onPause={this.handlePauseTimer}
          />
          <div className="buttons-wrapper">
            <Button onClick={this.handlePauseBtn}>Pause</Button>
            <Button onClick={this.handleStartBtn}>Start</Button>
          </div>
        </div>
      </>
    );
  }
}

export default ContinuousTimer;
