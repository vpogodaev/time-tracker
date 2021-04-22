import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import useInterval from "../../hooks/useInterval";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../utils/timeTransform";
import Clock from "../clock";
import Watch from "../watch";
import { watchStatuses } from "../../constants";

import "./styles.scss";

const pomodoroStatuses = {
  stopped: 0,
  work_running: 1,
  work_paused: 2,
  work_stopped: 3,
  work_over_running: 4,
  relax_running: 5,
  relax_paused: 6,
  relax_stopped: 7,
  relax_over_running: 8,
};

const PomodoroButtons = ({
  status,
  onStartWorkBtn,
  onPauseWorkBtn,
  onStartRelaxBtn,
  onPauseRelaxBtn,
  onStopBtn,
}) => {
  const getButton = (label, key, onClick, disabled = false) => {
    return (
      <Button key={key} onClick={onClick} disabled={disabled}>
        {label}
      </Button>
    );
  };

  const stop = (disabled) => getButton("Stop", 0, onStopBtn, disabled);
  const startWork = (disabled) =>
    getButton("Start work", 1, onStartWorkBtn, disabled);
  const pauseWork = (disabled) =>
    getButton("Pause work", 2, onPauseWorkBtn, disabled);
  const stopWork = (disabled) =>
    getButton("Stop work", 3, onStartRelaxBtn, disabled);
  const startRelax = (disabled) =>
    getButton("Start relax", 4, onStartRelaxBtn, disabled);
  const pauseRelax = (disabled) =>
    getButton("Pause relax", 5, onPauseRelaxBtn, disabled);
  const stopRelax = (disabled) =>
    getButton("Stop relax", 6, onStartWorkBtn, disabled);

  const buttonFactory = {
    // stopped
    0: [startWork(), pauseWork(true), stop(true)],
    // work_running
    1: [startWork(true), pauseWork(), stop()],
    // work_paused
    2: [startWork(), stopWork(), stop()],
    // work_stoped
    3: [startRelax(), pauseRelax(true), stop()],
    // work_over_running
    4: [startRelax(), pauseRelax(true), stop()],
    // relax_running
    5: [startRelax(true), pauseRelax(), stop()],
    // relax_paused
    6: [startRelax(), stopRelax(), stop()],
    // relax_stoped
    7: [startWork(), pauseWork(true), stop()],
    // relax_over_running
    8: [startWork(), pauseWork(true), stop()],
  };

  return <div className="buttons-wrapper">{buttonFactory[status]}</div>;
};

const PomodoroTimer = () => {
  const [workTimer, setWorkTimer] = useState({
    seconds: 0,
    initSeconds: 10,
    count: 0,
  });
  const [relaxTimer, setRelaxTimer] = useState({
    seconds: 0,
    initSeconds: 10,
    count: 0,
  });
  const [bigRelaxTimer, setBigRelaxTimer] = useState({
    needed: true,
    count: 0,
    period: 2,
    seconds: 0,
    initSeconds: 15,
  });
  const [overTime, setOverTime] = useState({
    seconds: 0,
    notifyInSec: 5,
  });
  const [status, setStatus] = useState(pomodoroStatuses.stopped);
  const [timerName, setTimerName] = useState("Timer");

  const resetToDefaultTime = (timer, setTimer) => {
    const { initSeconds } = timer;
    setTimer((prev) => ({
      ...prev,
      seconds: initSeconds,
    }));
  };
  useEffect(() => {
    if (status === pomodoroStatuses.stopped) {
      resetToDefaultTime(workTimer, setWorkTimer);
      resetToDefaultTime(relaxTimer, setRelaxTimer);
      resetToDefaultTime(bigRelaxTimer, setBigRelaxTimer);
    }
    // необходимо следить только за статусом
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const tick = (timer, setTimer) => {
    const { seconds } = timer;
    if (seconds <= 0) {
      return true;
    }

    const newSeconds = seconds - 1;
    setTimer((prev) => ({
      ...prev,
      seconds: newSeconds,
    }));
    if (newSeconds <= 0) {
      return true;
    }
    return false;
  };
  // work tick
  useInterval(
    () => {
      if (tick(workTimer, setWorkTimer)) {
        setWorkTimer((prev) => ({
          ...prev,
          count: prev.count + 1,
        }));
        setStatus(pomodoroStatuses.work_stopped);
      }
    },
    status === pomodoroStatuses.work_running ? 1000 : null
  );
  // relax tick
  useInterval(
    () => {
      if (tick(relaxTimer, setRelaxTimer)) {
        setRelaxTimer((prev) => ({
          ...prev,
          count: prev.count + 1,
        }));
        setStatus(pomodoroStatuses.relax_stopped);
      }
    },
    status === pomodoroStatuses.relax_running ? 1000 : null
  );
  // big relax tick
  useInterval(
    () => {
      if (tick(bigRelaxTimer, setBigRelaxTimer)) {
        setBigRelaxTimer((prev) => ({
          ...prev,
          count: prev.count + 1,
        }));
        setStatus(pomodoroStatuses.relax_stopped);
      }
    },
    status === pomodoroStatuses.relax_running &&
      workTimer.count % bigRelaxTimer.period === 0
      ? 1000
      : null
  );

  const onStartWorkBtn = () => {
    setStatus(pomodoroStatuses.work_running);
  };
  const onPauseWorkBtn = () => {
    setStatus(pomodoroStatuses.work_paused);
  };
  const onStartRelaxBtn = () => {
    setStatus(pomodoroStatuses.relax_running);
  };
  const onPauseRelaxBtn = () => {
    setStatus(pomodoroStatuses.relax_paused);
  };
  const onStopBtn = () => {
    setStatus(pomodoroStatuses.stopped);
  };

  const statusNameFactory = {
    0: "stopped",
    1: "started",
    2: "paused",
    3: "finished",
    4: "over time",
    5: "relax started",
    6: "relax paused",
    7: "relax finished",
    8: "relax over time",
  };
  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-timer__status">
        {timerName} {statusNameFactory[status]}
      </div>
      <Clock
        readOnly={true}
        hours={transformSecsToTime(workTimer.seconds).hours}
        minutes={transformSecsToTime(workTimer.seconds).minutes}
        seconds={transformSecsToTime(workTimer.seconds).seconds}
      />
      <PomodoroButtons
        status={status}
        onStartWorkBtn={onStartWorkBtn}
        onPauseWorkBtn={onPauseWorkBtn}
        onStartRelaxBtn={onStartRelaxBtn}
        onPauseRelaxBtn={onPauseRelaxBtn}
        onStopBtn={onStopBtn}
      />
    </div>
  );
};

export default PomodoroTimer;
