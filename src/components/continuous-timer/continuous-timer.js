import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import useInterval from "../../hooks/useInterval";
import useTimeout from "../../hooks/useTimeout";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../utils/timeTransform";
import Clock from "../clock";
import ClockButtons from "../clock-buttons/clock-buttons";
import Watch from "../watch/watch";
import { timerStatuses as statuses, watchStatuses } from "../../constants";

import "./styles.scss";

export default function ContinuousTimer(props) {
  const [hours, setHours] = useState(props.hours ? props.hours : 0);
  const [minutes, setMinutes] = useState(props.minutes ? props.minutes : 0);
  const [seconds, setSeconds] = useState(props.seconds ? props.seconds : 0);
  const [status, setStatus] = useState(statuses["s"]);
  const [hoursOver, setHoursOver] = useState(0);
  const [minutesOver, setMinutesOver] = useState(0);
  const [secondsOver, setSecondsOver] = useState(0);
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

  function handleOverTimeChange(_hoursOver, _minutesOver, _secondsOver) {
    setHoursOver(_hoursOver);
    setMinutesOver(_minutesOver);
    setSecondsOver(_secondsOver);
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
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setStatus(statuses["s"]);
    setNeedRepeat(true);
  }

  function canStart() {
    const secsToTick = transformTimeToSecs(hours, minutes, seconds);

    return status !== statuses["r"] && secsToTick && secsToTick > 0;
  }

  function finish() {
    setStatus(statuses["f"]);
    showNotification();

    const notifyAfterSecs = transformTimeToSecs(
      hoursOver,
      minutesOver,
      secondsOver
    );

    if (!notifyAfterSecs) {
      setStatus(statuses["f"]);

      setNeedRepeat(true);
    } else {
      setStatus(statuses["o"]);
    }
  }

  function showNotification() {
    const options = {
      body: "Звенит таймер",
      dir: "ltr",
    };
    new Notification("Таймер", options);
  }

  const readOnly = status !== statuses["s"] && status !== statuses["f"];
  // !
  const notifyAfterSecs = transformTimeToSecs(
    hoursOver,
    minutesOver,
    secondsOver
  );

  const watchStatus =
    status === statuses["o"] && notifyAfterSecs
      ? watchStatuses.r
      : watchStatuses.s;

  return (
    <div className="timer">
      Таймер:
      <Clock
        readOnly={readOnly}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onTimeChange={handleTimeChange}
      />
      <p>Просроченное время</p>
      Оповещать через:
      <Clock
        readOnly={readOnly}
        hours={hoursOver}
        minutes={minutesOver}
        seconds={secondsOver}
        onTimeChange={handleOverTimeChange}
      />
      Текущее время просрочки:
      <Watch
        status={watchStatus}
        notifyAfterSecs={notifyAfterSecs}
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
