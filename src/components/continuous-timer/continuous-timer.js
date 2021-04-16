import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Timer, { tryToRun } from "../timer";

import "./styles.scss";

class ContinuousTimer extends Component {
  constructor(props) {
    super(props);

    this.handleStartBtn = this.handleStartBtn.bind(this);
    this.handlePauseBtn = this.handlePauseBtn.bind(this);
    this.handleStartTimer = this.handleStartTimer.bind(this);
    this.handlePauseTimer = this.handlePauseTimer.bind(this);
    this.handleFinishTimer = this.handleFinishTimer.bind(this);
    this.handleTimerRepeatPrepare = this.handleTimerRepeatPrepare.bind(this);
    
    this.handleStartRepeat = this.handleStartRepeat.bind(this);
    this.handleFinishRepeat = this.handleFinishRepeat.bind(this);

    //console.log(tryToRun);
    this.state = {
      isTimerRunning: false,
      tryToRunTimer: tryToRun["d"],
      isRepeatRunning: false,
      tryToRunRepeat: tryToRun["d"],
    };
  }

  handleStartBtn() {
    console.log("handleStartBtn");
    const { isTimerRunning } = this.state;
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

  handleFinishTimer() {
    console.log("handleFinishTimer");
    this.setState({
      isTimerRunning: false,
      tryToRunTimer: tryToRun["r"],
      // isRepeatRunning: false,
      // tryToRunRepeat: tryToRun["s"],
    });
  }

  handleTimerRepeatPrepare() {
    console.log("handleTimerRepeatPrepare");
    this.setState({
      isTimerRunning: false,
      tryToRunTimer: tryToRun["d"],
    });
  }


  handleStartRepeat() {
    console.log("handleStartRepeat");
    this.setState({ isRepeatRunning: true, tryToRunRepeat: tryToRun["d"] });
  }

  handleFinishRepeat() {
    console.log("handleFinishRepeat");
    this.setState({ isRepeatRunning: false, tryToRunRepeat: tryToRun["d"] });
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
            onFinish={this.handleFinishTimer}
          />
          {/* <Timer 
            isRunning={this.state.isRepeatRunning}
            tryToRun={this.state.tryToRunRepeat}
            onStart={this.handleStartRepeat}
            onFinish={this.handleStartRepeat}
          /> */}
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
