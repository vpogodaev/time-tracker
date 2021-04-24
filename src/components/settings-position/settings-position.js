import React from "react";
import { Form } from "react-bootstrap";

import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../utils/timeTransform";

import Clock from "../clock";

import "./styles.scss";

const SettingsPosition = ({
  seconds,
  overSeconds,
  needsOver,
  needsStop,
  needsNotify,
  onTimeChange,
  onOverTimeChange,
  onSwitchChange,
}) => {
  const time = transformSecsToTime(seconds);
  const overTime = transformSecsToTime(overSeconds);

  const handleOnTimeChange = (hours, minutes, seconds, onChange) => {
    const secs = transformTimeToSecs(hours, minutes, seconds);
    onChange(secs);
  };

  return (
    <div>
      <Clock
        readOnly={false}
        hours={time.hours}
        minutes={time.minutes}
        seconds={time.seconds}
        onTimeChange={(h, m, s) => handleOnTimeChange(h, m, s, onTimeChange)}
      />
      <Form.Check
        type="switch"
        label="Needs over"
        id="workTimerNeedsOver"
        checked={needsOver}
        onChange={(e) => onSwitchChange(e, "needsOver")}
      />
      <Form.Check
        type="switch"
        label="Needs stop"
        id="workTimerNeedsStop"
        checked={needsStop}
        onChange={(e) => onSwitchChange(e, "needsStop")}
      />
      <Form.Check
        type="switch"
        label="Needs notify"
        id="workTimerNeedsNotify"
        checked={needsNotify}
        onChange={(e) => onSwitchChange(e, "needsNotify")}
      />
      Over notify in
      <Clock
        readOnly={false}
        hours={overTime.hours}
        minutes={overTime.minutes}
        seconds={overTime.seconds}
        onTimeChange={(h, m, s) =>
          handleOnTimeChange(h, m, s, onOverTimeChange)
        }
      />
    </div>
  );
};

export default SettingsPosition;
