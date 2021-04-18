import React, { useEffect, useRef, useState } from "react";
import Clock from "../clock";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../utils/timeTransform";
import { timerStatuses as statuses } from "../../constants";

import "./styles.scss";

import useInterval from "../../hooks/useInterval";
import useTimeout from "../../hooks/useTimeout";
import ClockButtons from "../clock-buttons/clock-buttons";

export default function Timer(props) {
  const [hours, setHours] = useState(props.hours ? props.hours : 0);
  const [minutes, setMinutes] = useState(props.minutes ? props.minutes : 0);
  const [seconds, setSeconds] = useState(props.seconds ? props.seconds : 0);
  const [status, setStatus] = useState(statuses["s"]);
  const [needRepeat, setNeedRepeat] = useState(false);

  const initTimeRef = useRef();

  const isRunning = status === statuses["r"];
  useInterval(() => tick(), isRunning ? 1000 : null);

  function tick() {
    let secsToTick = transformTimeToSecs(hours, minutes, seconds) - 1;
    const time = transformSecsToTime(secsToTick);
    setHours(time.hours);
    setMinutes(time.minutes);
    setSeconds(time.seconds);

    if (secsToTick <= 0) {
      finish();
    }
  }

  useTimeout(() => repeatTimeout(), needRepeat ? 300 : null);

  function repeatTimeout() {
    setHours(initTimeRef.current.hours);
    setMinutes(initTimeRef.current.minutes);
    setSeconds(initTimeRef.current.seconds);
    setNeedRepeat(false);
  }

  // event handlers
  function handleTimeChange(_hours, _minutes, _seconds) {
    setHours(_hours);
    setMinutes(_minutes);
    setSeconds(_seconds);
  }

  function handleStartBtn() {
    if (!canStart()) {
      return;
    }

    if (!initTimeRef.current) {
      initTimeRef.current = { hours, minutes, seconds };
    }

    setStatus(statuses["r"]);
  }

  function handlePauseBtn() {
    if (status !== statuses["r"]) {
      return;
    }
    setStatus(statuses["p"]);
  }

  function handleStopBtn() {
    if (status !== statuses["p"]) {
      return;
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setStatus(statuses["p"]);
    setNeedRepeat(true);
  }

  function canStart() {
    const secsToTick = transformTimeToSecs(hours, minutes, seconds);

    return status !== statuses["r"] && secsToTick && secsToTick > 0;
  }

  function finish() {
    setStatus(statuses["f"]);
    showNotification();
    setNeedRepeat(true);
  }

  function showNotification() {
    const options = {
      body: "Звенит таймер",
      dir: "ltr",
    };
    new Notification("Таймер", options);
  }

  const readOnly = status !== statuses["s"] && status !== statuses["f"];

  return (
    <div className="timer">
      <Clock
        readOnly={readOnly}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onTimeChange={handleTimeChange}
      />
      <ClockButtons
        onStartBtn={handleStartBtn}
        onPauseBtn={handlePauseBtn}
        onStopBtn={handleStopBtn}
        status={status}
      />
    </div>
  );
}
