import React from 'react'
import NumberInput from '../number-input';

import './styles.scss';

export default function Clock(props) {
  const timeToString = (time) => {
    return time < 10 ? "0" + time : time;
  }

  const handleChangeNumber = (value, name) => {
    let { hours, minutes, seconds } = props;

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

    props.onTimeChange(hours, minutes, seconds);
  }

  return (
    <div className="clock">
      <NumberInput
        value={timeToString(props.hours)}
        onChange={handleChangeNumber}
        name="hours"
        readOnly={props.readOnly}
      />
      <div className="dots">:</div>
      <NumberInput
        value={timeToString(props.minutes)}
        onChange={handleChangeNumber}
        name="minutes"
        readOnly={props.readOnly}
      />
      <div className="dots">:</div>
      <NumberInput
        value={timeToString(props.seconds)}
        onChange={handleChangeNumber}
        name="seconds"
        readOnly={props.readOnly}
      />
    </div>
  );
}