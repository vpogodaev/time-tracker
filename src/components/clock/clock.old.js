// классовый компонент

import React, { Component } from 'react'
import NumberInput from '../number-input';

import './styles.scss';

class Clock extends Component {
  constructor(props) {
    super(props);

    this.handleChangeNumber = this.handleChangeNumber.bind(this);
  }

  timeToString(time) {
    return time < 10 ? "0" + time : time;
  }

  handleChangeNumber(value, name) {
    let { hours, minutes, seconds } = this.props;

    const addHour = (value) => {
      if (value >= 0 && value <= 23) {
        hours = +value;
      }
    };
    const addMinute = (value) => {
      if (value >= 0 && value <= 59) {
        minutes = +value;
      } else if (value > 59 && hours < 23) {
        minutes = 0;
        addHour(hours + 1);
      } else if (value < 0 && hours > 0) {
        minutes = 59;
        addHour(hours - 1);
      }
    };
    const addSecond = (value) => {
      if (value >= 0 && value <= 59) {
        seconds = +value;
      } else if (value > 59 && minutes <= 59) {
        seconds = 0;
        addMinute(minutes + 1);
      } else if (value < 0 && (minutes > 0 || hours > 0)) {
        seconds = 59;
        addMinute(minutes - 1);
      }
    };

    if (name === "hours") {
      addHour(value);
    } else if (name === "minutes") {
      addMinute(value);
    } else if (name === "seconds") {
      addSecond(value);
    }

    this.props.onTimeChange(hours, minutes, seconds);
  }

  render() {
    return (
      <div className="clock">
        <NumberInput
          value={this.timeToString(this.props.hours)}
          onChange={this.handleChangeNumber}
          name="hours"
          readOnly={this.props.readOnly}
        />
        <div className="dots">:</div>
        <NumberInput
          value={this.timeToString(this.props.minutes)}
          onChange={this.handleChangeNumber}
          name="minutes"
          readOnly={this.props.readOnly}
        />
        <div className="dots">:</div>
        <NumberInput
          value={this.timeToString(this.props.seconds)}
          onChange={this.handleChangeNumber}
          name="seconds"
          readOnly={this.props.readOnly}
        />
      </div>
    );
  }
}

export default Clock;