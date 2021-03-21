import React, { Component } from 'react'

import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);

    // this.watch = new StopWatch(() => { this.updateSec(this.watch.getTime()) });
    this.timer = new Timer(
      10,
      () => { this.updateSec(this.timer.getTime()) },
      () => { this.setState({ over: true }) },
      true,
      // 5,
      // () => {
      //   console.log('Overtime!', this.timer.getTime())
      // }
    );

    this.handleClick = this.handleClick.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    //this.log = this.log.bind(this);
  }

  state = {
    isToggled: true,
    isRunning: false,
    timeSec: 0,
    over: false
  }

  updateSec(sec) {
    this.setState({ timeSec: sec });
  }

  start() {
    this.timer.start();
    // if (!this.state.isRunning) {
    //   console.log('start');
    //   this.i = 0;
    //   this.watch = setInterval(() => this.log(), 1000);
    //   this.setState({ isRunning: true });
    // }
  }

  stop() {
    this.timer.stop();
  }

  log() {
    console.log(this.i++);
  }

  handleClick() {
    this.setState({ isToggled: !this.state.isToggled });
    //console.log('handle');
  }

  render() {
    return (
      <div>
        <div>
          {this.state.timeSec}
        </div>
        <div>
          {this.state.over ? 'Over!' : ''}
        </div>
        <div>
          <button onClick={this.handleClick}>{this.state.isToggled ? 'On' : 'Off'}</button>
        </div>
        <div>
          <button onClick={this.start}>Start</button>
        </div>
        <div>
          <button onClick={this.stop}>Stop</button>
        </div>
      </div>
    );
  }
}

// // 1 секунда
// class StopWatch {
//   #handleTick;
//   #interval;
//   #curTimeSec;
//   #isRunning;
//   #watchName;
//   #watch;

//   constructor(handleTick, name = 'watch') {
//     this.#handleTick = handleTick;
//     //this.intervalType = intervalType && intervalType === 'ms' ? intervalType : 's';
//     this.#interval = 1000;
//     this.#curTimeSec = 0;
//     this.#isRunning = false;
//     this.#watchName = name;
//   }

//   start() {
//     if (this.#isRunning) {
//       console.log(`Watch ${this.#watchName} is already running`);
//       return;
//     }

//     this.#isRunning = true;
//     this.#watch = setInterval(() => {
//       this.#curTimeSec++;
//       this.#handleTick()
//     }, this.#interval);
//   }

//   stop() {
//     if (!this.#isRunning) {
//       console.log(`Watch ${this.#watchName} has not been started yet`);
//       return;
//     }

//     clearInterval(this.#watch);
//     this.#isRunning = false;
//   }

//   getTime() {
//     return this.#curTimeSec;
//   }
// }

class Timer {
  static #sec = 1000;

  #watch;
  #continueWatch;
  #currentSec = 0;
  #isOver = false;
  #secsToTick;
  #onTick;
  #onOver;
  #isContinue;
  #continueSec;
  #onContinue;
  #isRunning = false;
  constructor(secs, onTick, onOver, isContinue, continueSec, onContinue) {
    this.#secsToTick = secs;
    this.#onTick = onTick;
    this.#onOver = onOver;
    this.#isContinue = isContinue;
    this.#onTick = onTick;
    this.#continueSec = continueSec;
    this.#onContinue = onContinue;
  }

  start() {
    if (this.#isRunning) {
      console.log(`Watch is already running`);
      return;
    }
    
    this.#isOver = false;
    this.#isRunning = true;
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + this.#secsToTick);
    this.#watch = setInterval(() => {
      this.#currentSec++;
      this.#onTick();
      const now = new Date();
      // console.log(now);
      // console.log(deadline);
      if (now >= deadline && !this.#isOver) {
        this.#onOver();
        this.#isOver = true;
        if (this.#isContinue && this.#continueSec && this.#onContinue) {
          this.#continueWatch = setInterval(() => {
            this.#onContinue();
          }, this.#continueSec * Timer.#sec);
        } else {
          clearInterval(this.#watch);
        }
      }
    }, Timer.#sec);
  }

  stop() {
    if (!this.#isRunning) {
      console.log(`Watch has not been started yet`);
      return
    }

    clearInterval(this.#watch);
    if (this.#continueWatch) {
      clearInterval(this.#continueWatch);
    }
    this.#isRunning = false;
  }

  getTime() {
    return this.#currentSec;
  }
}

export default App;