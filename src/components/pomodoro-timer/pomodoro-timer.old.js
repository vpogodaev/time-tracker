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

const PomodoroTimer = () => {
  const [workTimer, setWorkTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    initHours: 0,
    initMinutes: 0,
    initSeconds: 0,
  });
  const [relaxTimer, setRelaxTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    initHours: 0,
    initMinutes: 0,
    initSeconds: 0,
  });
  const [overTime, setOverTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [status, setStatus] = useState(pomodoroStatuses.stopped);

  const tick = (timer, setTimer, finish) => {
    const { hours, minutes, seconds } = timer;
    let secsToTick = transformTimeToSecs(hours, minutes, seconds) - 1;
    const time = transformSecsToTime(secsToTick);

    console.log(workTimer);
    setTimer((prev) => ({
      ...prev,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
    }));
    console.log(workTimer);

    if (secsToTick <= 0) {
      finish();
    }
  };

  const canStartTimer = (timer) => {
    const { hours, minutes, seconds } = timer;
    return transformTimeToSecs(hours, minutes, seconds) > 0;
  };

  const trySetTimeFromInit = (timer, setTimer) => {
    const { initHours, initMinutes, initSeconds } = timer;
    if (!initHours && !initMinutes && !initSeconds) {
      return false;
    }

    setTimer((prev) => ({
      ...prev,
      hours: initHours,
      minutes: initMinutes,
      seconds: initSeconds,
    }));

    console.log(timer);
    return true;
  };

  const startWorkTimer = () => {
    console.log("startWorkTimer");
    if (!canStartTimer(workTimer)) {
      if (!trySetTimeFromInit(workTimer, setWorkTimer)) {
        return;
      }
    }

    const {
      hours,
      minutes,
      seconds,
      initHours,
      initMinutes,
      initSeconds,
    } = workTimer;

    if (
      (hours || seconds || minutes) &&
      !initHours &&
      !initMinutes &&
      !initSeconds
    ) {
      setWorkTimer((prev) => ({
        ...prev,
        initHours: hours,
        initMinutes: minutes,
        initSeconds: seconds,
      }));
    }
    setStatus(pomodoroStatuses.work_running);
  };

  // work tick
  useInterval(
    () => {
      const workFinish = () => {
        setStatus(pomodoroStatuses.work_stopped);
        trySetTimeFromInit(workTimer, setWorkTimer);
      };
      tick(workTimer, setWorkTimer, workFinish);
    },
    status === pomodoroStatuses.work_running ? 1000 : null
  );

  const startRelaxTimer = () => {
    console.log("startRelaxTimer");
    if (!canStartTimer(relaxTimer)) {
      if (!trySetTimeFromInit(relaxTimer, setRelaxTimer)) {
        return;
      }
    }

    const {
      hours,
      minutes,
      seconds,
      initHours,
      initMinutes,
      initSeconds,
    } = relaxTimer;

    if (
      (hours || seconds || minutes) &&
      !initHours &&
      !initMinutes &&
      !initSeconds
    ) {
      setRelaxTimer((prev) => ({
        ...prev,
        initHours: hours,
        initMinutes: minutes,
        initSeconds: seconds,
      }));
    }
    setStatus(pomodoroStatuses.relax_running);
  };

  // relax tick
  useInterval(
    () => {
      const relaxFinish = () => {
        setStatus(pomodoroStatuses.relax_stopped);
        trySetTimeFromInit(relaxTimer, setRelaxTimer);
      };
      tick(relaxTimer, setRelaxTimer, relaxFinish);
    },
    status === pomodoroStatuses.relax_running ? 1000 : null
  );

  const needOverTimer = () => {
    const { hours, minutes, seconds } = overTime;
    return transformTimeToSecs(hours, minutes, seconds) > 0;
  };

  const needRelaxTimer = () => {
    const { hours, minutes, seconds } = relaxTimer;
    return transformTimeToSecs(hours, minutes, seconds) > 0;
  };

  useEffect(() => {
    console.log(status);
    if (status === pomodoroStatuses.work_stopped) {
      if (needOverTimer()) {
        setStatus(pomodoroStatuses.work_over_running);
      } else if (needRelaxTimer()) {
        startRelaxTimer();
      } else {
        startWorkTimer();
      }
    } else if (status === pomodoroStatuses.relax_stopped) {
      if (needOverTimer()) {
        setStatus(pomodoroStatuses.relax_over_running);
      } else {
        startWorkTimer();
      }
    }
  }, [status]);

  const clearInitTime = (setTime) => {
    setTime((prev) => ({
      ...prev,
      initHours: 0,
      initMinutes: 0,
      initSeconds: 0,
    }));
  };

  const stop = () => {
    trySetTimeFromInit(workTimer, setWorkTimer);
    trySetTimeFromInit(relaxTimer, setRelaxTimer);
    clearInitTime(setWorkTimer);
    clearInitTime(setRelaxTimer);
    setStatus(pomodoroStatuses.stopped);
  };

  const handleStartWorkTimerBtn = () => {
    if (status !== pomodoroStatuses.work_paused) {
      stop();
    }
    startWorkTimer();
  };

  const handleStopBtn = () => stop();

  const handlePauseWorkBtn = () => {
    setStatus(pomodoroStatuses.work_paused);
  };

  const handleStartRelaxBtn = () => {
    if (status !== pomodoroStatuses.relax_paused) {
      stop();
    }
    startRelaxTimer();
  };

  const handlePauseRelaxBtn = () => {
    setStatus(pomodoroStatuses.relax_paused);
  };

  const handleTimeChange = (_hours, _minutes, _seconds, setTimer) => {
    setTimer((prevData) => ({
      ...prevData,
      hours: _hours,
      minutes: _minutes,
      seconds: _seconds,
    }));
  };

  const watchStatus =
    status === pomodoroStatuses.work_over_running ||
    status === pomodoroStatuses.relax_over_running
      ? watchStatuses.r
      : watchStatuses.s;

  const readOnly = status !== pomodoroStatuses.stopped;

  return (
    <div className="timer">
      <p>{status}</p>
      <p>Таймеры:</p>
      Основной:
      <Clock
        readOnly={readOnly}
        hours={workTimer.hours}
        minutes={workTimer.minutes}
        seconds={workTimer.seconds}
        onTimeChange={(h, m, s) => handleTimeChange(h, m, s, setWorkTimer)}
      />
      Отдых:
      <Clock
        readOnly={readOnly}
        hours={relaxTimer.hours}
        minutes={relaxTimer.minutes}
        seconds={relaxTimer.seconds}
        onTimeChange={(h, m, s) => handleTimeChange(h, m, s, setRelaxTimer)}
      />
      <p>Просроченное время</p>
      Оповещать через:
      <Clock
        readOnly={readOnly}
        hours={overTime.hours}
        minutes={overTime.minutes}
        seconds={overTime.seconds}
        onTimeChange={(h, m, s) => handleTimeChange(h, m, s, setOverTime)}
      />
      Текущее время просрочки:
      <Watch
        status={watchStatus}
        notifyAfterSecs={transformTimeToSecs(
          overTime.hours,
          overTime.minutes,
          overTime.seconds
        )}
      />
      <div className="buttons-wrapper">
        <Button
          disabled={status === pomodoroStatuses.work_running}
          onClick={handleStartWorkTimerBtn}
        >
          Start work timer
        </Button>
        <Button
          disabled={status !== pomodoroStatuses.work_running}
          onClick={handlePauseWorkBtn}
        >
          Pause work timer
        </Button>
        <Button
          disabled={
            status !== pomodoroStatuses.work_running &&
            status !== pomodoroStatuses.work_paused &&
            status !== pomodoroStatuses.work_over_running &&
            status !== pomodoroStatuses.relax_paused
          }
          onClick={handleStartRelaxBtn}
        >
          Start relax timer
        </Button>
        <Button
          disabled={status !== pomodoroStatuses.relax_running}
          onClick={handlePauseRelaxBtn}
        >
          Pause relax timer
        </Button>
        <Button
          disabled={status === pomodoroStatuses.stopped}
          onClick={handleStopBtn}
        >
          Stop
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
