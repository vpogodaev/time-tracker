import React, { Component } from 'react'

import './styles.scss';

class Timer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    secondsToTick: '',
    hours: 0,
    minutes: 0,
    seconds: 0,
    running: false
  }

  componentDidMount() {
    if (!("Notification" in window)) {
      console.log('notifications disabled');
    } else {
      //console.log('notifications enabled');
      Notification.requestPermission();
    }
  }

  transformTimeToSeconds() {
    return +this.state.hours * 60 * 60
      + +this.state.minutes * 60
      + +this.state.seconds;
  }

  transformSecondsToTime(secondsToTick = this.state.secondsToTick) {
    let seconds = secondsToTick;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60 + '';
    let hours = Math.floor(minutes / 60) + '';
    minutes = minutes % 60 + '';

    return {hours, minutes, seconds}
    // this.setState({
    //   hours,
    //   minutes,
    //   seconds
    // });
  }

  showNotification() {
    const options = {
      body: "This is the body of the Notification",
      icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      dir: "ltr"
    };
    new Notification('Hey', options);
  }

  onStart = () => {
    if (this.state.running) {
      return;
    }
    const {hours, minutes, seconds} = this.transformSecondsToTime();
    this.setState({running: true, hours, minutes, seconds});
    this.timer = setInterval(() => this.handleTick(), 1000);
  }

  handleTick() {
    let secondsToTick = this.state.secondsToTick - 1;
    let running = this.state.running;
    const {hours, minutes, seconds} = this.transformSecondsToTime(secondsToTick);
    if (secondsToTick < 1 && running) {
      clearInterval(this.timer);
      running = false;
      this.showNotification();
    }

    this.setState({secondsToTick, running, hours, minutes, seconds});
  }

  handleOver() {
    alert('Over!');
  }

  test() {

  }

  handleChange = (e) => {
    const secondsToTick = +e.target.value;
    if (isNaN(secondsToTick)/* || secondsToTick > 23*/) {
      return;
    }
    this.setState({ secondsToTick });
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.secondsToTick} onChange={this.handleChange} />
        <button onClick={this.onStart}>Start</button>
        <div>
          <input type="text" value={this.state.hours} readOnly/>
          <input type="text" value={this.state.minutes} readOnly/>
          <input type="text" value={this.state.seconds} readOnly/>
        </div>
        <button onClick={() => alert(this.transformTimeToSeconds())}>get time</button>
        <button onClick={this.test}>test</button>
      </div>
    );
  }
}

export default Timer;