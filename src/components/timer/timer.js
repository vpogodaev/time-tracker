import React, { Component } from "react";
import { Button } from "react-bootstrap";

import "./styles.scss";

class NumberInput extends Component {
  constructor(props) {
    super(props);

    this.maxValue = props.maxValue;
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const s = e.target.value;
    e.target.value = '';
    this.props.onChange(s, this.props.name)
  }

  render() {
    return (
      <input
        className="input-time"
        type="number"
        value={this.props.value}
        onChange={this.onChange}
        readOnly={this.props.readOnly}
      />
    );
  }
}

class Clock extends Component {
  constructor(props) {
    super(props);

    this.handleChangeNumber = this.handleChangeNumber.bind(this);

    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  timeToString(time) {
    return time < 10 ? '0' + time : time;
  }

  handleChangeNumber(value, name) {
    let { hours, minutes, seconds } = this.state;
    
    const addHour = (value) => {
      if (value >= 0 && value <= 23) {
        hours = +value;
      }
    }
    const addMinute = (value) => {
      if (value >= 0 && value <= 59) {
        minutes = +value;
      } else if (value > 59 && this.state.hours < 23) {
        minutes = 0;
        addHour(hours + 1);
      } else if (value < 0 && this.state.hours > 0) {
        minutes = 59;
        addHour(hours - 1);
      }
    }
    const addSecond = (value) => {
      if (value >= 0 && value <= 59) {
        seconds = +value;
      } else if (value > 59 && this.state.minutes <= 59) {
        seconds = 0;
        addMinute(minutes + 1);
      } else if (value < 0 && this.state.minutes >= 0) {
        seconds = 59;
        addMinute(minutes - 1);
      }
    }
    
    if (name === "hours") {
      addHour(value);
    } else if (name === "minutes") {
      addMinute(value);
    } else if (name === "seconds") {
      addSecond(value);
    }

    this.setState({
      hours,
      minutes,
      seconds,
    });
  }

  render() {
    return (
      <div className="clock">
        <NumberInput
          value={this.timeToString(this.state.hours)}
          maxValue={23}
          onChange={this.handleChangeNumber}
          onAboveValue={this.handleAboveInput}
          name="hours"
        />
        <div className="dots">:</div>
        <NumberInput
          value={this.timeToString(this.state.minutes)}
          maxValue={59}
          onChange={this.handleChangeNumber}
          onAboveValue={this.handleAboveInput}
          name="minutes"
        />
        <div className="dots">:</div>
        <NumberInput
          value={this.timeToString(this.state.seconds)}
          maxValue={59}
          onChange={this.handleChangeNumber}
          onAboveValue={this.handleAboveInput}
          name="seconds"
        />          
      </div>
    );
  }
}

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secondsToTick: "",
      running: false,
    };
  }

  render() {
    return (
      <div className="timer">
        <Clock />
        <div className="buttons-wrapper">
          <Button onClick={() => alert("this is stop")}>Stop</Button>
          <Button onClick={this.onStart}>Start</Button>
        </div>
      </div>
    );
  }
}

export default Timer;

// class Timer extends Component {
//   constructor(props) {
//     super(props);
//   }

//   state = {
//     secondsToTick: '',
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//     running: false,
//     name: ''
//   }

//   componentDidMount() {
//     if (!("Notification" in window)) {
//       console.log('notifications disabled');
//     } else {
//       //console.log('notifications enabled');
//       Notification.requestPermission();
//     }
//   }

//   transformTimeToSeconds() {
//     return +this.state.hours * 60 * 60
//       + +this.state.minutes * 60
//       + +this.state.seconds;
//   }

//   transformSecondsToTime(secondsToTick = this.state.secondsToTick) {
//     let seconds = secondsToTick;
//     let minutes = Math.floor(seconds / 60);
//     seconds = seconds % 60 + '';
//     let hours = Math.floor(minutes / 60) + '';
//     minutes = minutes % 60 + '';

//     return { hours, minutes, seconds }
//     // this.setState({
//     //   hours,
//     //   minutes,
//     //   seconds
//     // });
//   }

//   showNotification() {
//     const options = {
//       body: `Звенит таймер${this.state.name ? ` ${this.state.name}` : ''}`,
//       icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//       dir: "ltr"
//     };
//     new Notification('Таймер', options);
//   }

//   onStart = () => {
//     const { running, secondsToTick } = this.state;
//     if (running || !secondsToTick || secondsToTick < 1) {
//       return;
//     }
//     const { hours, minutes, seconds } = this.transformSecondsToTime();
//     this.setState({ running: true, hours, minutes, seconds });
//     this.timer = setInterval(() => this.handleTick(), 1000);
//   }

//   handleTick() {
//     let secondsToTick = this.state.secondsToTick - 1;
//     let running = this.state.running;
//     const { hours, minutes, seconds } = this.transformSecondsToTime(secondsToTick);
//     if (secondsToTick < 1 && running) {
//       clearInterval(this.timer);
//       running = false;
//       this.showNotification();
//     }

//     this.setState({ secondsToTick, running, hours, minutes, seconds });
//   }

//   handleOver() {
//     alert('Over!');
//   }

//   test() {
//     alert(123);
//   }

//   handleChange = (e) => {
//     const secondsToTick = +e.target.value;
//     if (isNaN(secondsToTick)/* || secondsToTick > 23*/) {
//       return;
//     }
//     this.setState({ secondsToTick });
//   }

//   handleChangeName = (e) => this.setState({ name: e.target.value });

//   handleMinutesChange = (e) => {
//     const value = e.target.value;
//     alert(+value);
//   }

//   handleNumberChange = (e) => {
//     const value = e.target.value;
//     if (value < 0) {
//       e.target.value = '00';
//     }
//     else if (value >= 0 && value < 10) {
//       e.target.value = '0' + +value;
//     }
//     else if (value > 60) {
//       e.target.value = 60;
//     }
//     else {
//       e.target.value = +value;
//     }
//   }

//   render() {
//     return (
//       <div className="timer">
//         <label>
//           Название:
//           <input type="text" value={this.state.name} onChange={this.handleChangeName} />
//         </label>
//         <br />
//         <label>
//           Время:
//           <input type="text" value={this.state.secondsToTick} onChange={this.handleChange} />
//         </label>

//         <br />

//         <input
//           className="input-time"
//           type="number"
//           defaultValue="00"
//           onChange={this.handleNumberChange} />
//         <div>
//           <div className="time-wrapper">
//             <input
//               className="input-time"
//               type="number"
//               defaultValue="00"
//               onChange={this.handleMinutesChange} />
//             <div className="time">:</div>
//             <input
//               className="input-time"
//               type="number"
//               defaultValue="00"
//               onChange={this.handleNumberChange} />
//             <div className="time">:</div>
//             <input
//               className="input-time"
//               type="number"
//               defaultValue="00"
//               onChange={this.handleNumberChange} />
//           </div>
//           <div className="buttons-wrapper">
//             <Button onClick={() => alert('this is stop')}>Stop</Button>
//             <Button onClick={this.onStart}>Start</Button>
//           </div>
//           <div>
//             <input type="text" value={this.state.hours} readOnly />
//             <input type="text" value={this.state.minutes} readOnly />
//             <input type="text" value={this.state.seconds} readOnly />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
