import { nanoid } from "nanoid";
import React from "react";
import { Form } from "react-bootstrap";

import { transSecsToTime, transTimeToSecs } from "../../utils/timeTransform";

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
  settingName,
}) => {
  const time = transSecsToTime(seconds);
  const overTime = transSecsToTime(overSeconds);

  const handleOnTimeChange = (hours, minutes, seconds, onChange) => {
    const secs = transTimeToSecs(hours, minutes, seconds);
    onChange(secs);
  };

  return (
    <div className="settings__position">
      <div className="settings__title settings__title_small">
        {settingName}:
      </div>
      <div className="settings__clock-wrapper">
        <div className="settings__clock-name">Timer</div>
        <Clock
          readOnly={false}
          hours={time.hours}
          minutes={time.minutes}
          seconds={time.seconds}
          onTimeChange={(h, m, s) => handleOnTimeChange(h, m, s, onTimeChange)}
        />
        <div className="settings__clock-name">Over notify in</div>
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
      <ul className="settings__switches">
        <li>
          <Form.Check
            type="switch"
            label="Needs over"
            id={nanoid()}
            checked={needsOver}
            onChange={(e) => onSwitchChange(e, "needsOver")}
          />
        </li>
        <li>
          <Form.Check
            type="switch"
            label="Needs stop"
            id={nanoid()}
            checked={needsStop}
            onChange={(e) => onSwitchChange(e, "needsStop")}
          />
        </li>
        <li>
          <Form.Check
            type="switch"
            label="Needs notify"
            id={nanoid()}
            checked={needsNotify}
            onChange={(e) => onSwitchChange(e, "needsNotify")}
          />
        </li>
      </ul>
    </div>
  );
};

export default SettingsPosition;
