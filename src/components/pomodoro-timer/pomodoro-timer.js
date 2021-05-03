import React, { useEffect, useState } from "react";

import useInterval from "../../hooks/useInterval";
import { getTimeNum, transSecsToTime } from "../../utils/timeTransform";
import Clock from "../clock";
import PomodoroButtons from "../pomodoro-buttons";

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

const PomodoroTimer = ({
  settingsBtnComponent,
  settingsComponent,
  workSettings,
  relaxSettings,
  bigRelaxSettings,
}) => {
  const [workTimer, setWorkTimer] = useState({
    seconds: 0,
    initSeconds: workSettings.seconds,
    count: 0,
    needsNotify: workSettings.needsNotify,
    needsStop: workSettings.needsStop,
    overSeconds: workSettings.overSeconds,
    needsOver: workSettings.needsOver,
    initNeedsOver: workSettings.needsOver,
  });
  const [relaxTimer, setRelaxTimer] = useState({
    seconds: 0,
    initSeconds: relaxSettings.seconds,
    count: 0,
    needsNotify: relaxSettings.needsNotify,
    needsStop: relaxSettings.needsStop,
    overSeconds: relaxSettings.overSeconds,
    needsOver: relaxSettings.needsOver,
    initNeedsOver: relaxSettings.needsOver,
  });
  const [bigRelaxTimer, setBigRelaxTimer] = useState({
    seconds: 0,
    initSeconds: bigRelaxSettings.seconds,
    count: 0,
    needsNotify: bigRelaxSettings.needsNotify,
    needsStop: bigRelaxSettings.needsStop,
    overSeconds: bigRelaxSettings.overSeconds,
    needsOver: bigRelaxSettings.needsOver,
    initNeedsOver: bigRelaxSettings.needsOver,
    period: bigRelaxSettings.period,
  });
  const [displayTimer, setDisplayTimer] = useState({
    hours: 0,
    seconds: 0,
    minutes: 0,
  });
  const [overTime, setOverTime] = useState({
    seconds: 0,
  });
  const [status, setStatus] = useState(pomodoroStatuses.stopped);
  const [timerName, setTimerName] = useState("Timer");

  // onMount
  // workSettings
  const saveSettings = (from, set) => {
    const { seconds, overSeconds, needsNotify, needsStop, needsOver } = from;
    set((prev) => ({
      ...prev,
      seconds,
      initSeconds: seconds,
      needsNotify,
      needsStop,
      overSeconds,
      needsOver,
      initNeedsOver: workSettings.needsOver,
    }));
  };
  useEffect(() => {
    //console.log(workSettings);
    setStatus(pomodoroStatuses.stopped);

    saveSettings(workSettings, setWorkTimer);
    saveSettings(relaxSettings, setRelaxTimer);
    saveSettings(bigRelaxSettings, setBigRelaxTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workSettings, relaxSettings, bigRelaxSettings]);

  const relaxType =
    status === 3 || (status >= 5 && status <= 8)
      ? bigRelaxTimer.initSeconds > 0 &&
        workTimer.count > 0 &&
        workTimer.count % bigRelaxTimer.period === 0
        ? 2
        : 1
      : 0;

  const resetToDefaultTime = (timer, setTimer) => {
    const { initSeconds, initNeedsOver } = timer;
    setTimer((prev) => ({
      ...prev,
      seconds: initSeconds,
      needsOver: initNeedsOver,
    }));
  };
  const updateDisplayTime = (secs) => {
    const { hours, minutes, seconds } = transSecsToTime(secs);
    setDisplayTimer({
      hours,
      minutes,
      seconds,
    });
  };
  const resetOverTime = () => {
    setOverTime((prev) => ({
      ...prev,
      seconds: 0,
    }));
  };
  const showNotification = (name = timerName, body) => {
    const options = {
      body: body,
      dir: "ltr",
    };
    new Notification(name, options);
  };
  // переключение статуса
  useEffect(() => {
    //console.log('status change', new Date());
    if (status === pomodoroStatuses.stopped) {
      resetToDefaultTime(workTimer, setWorkTimer);
      resetToDefaultTime(relaxTimer, setRelaxTimer);
      resetToDefaultTime(bigRelaxTimer, setBigRelaxTimer);
    } else if (status === pomodoroStatuses.work_stopped) {
      if (workTimer.needsNotify) {
        showNotification("Work done");
      }
      resetToDefaultTime(workTimer, setWorkTimer);
      if (workTimer.needsOver) {
        resetOverTime();
        setStatus(pomodoroStatuses.work_over_running);
      } else if (!workTimer.needsStop) {
        setStatus(pomodoroStatuses.relax_running);
      }
    } else if (status === pomodoroStatuses.relax_stopped) {
      if (
        (relaxType === 1 && relaxTimer.needsNotify) ||
        (relaxType === 2 && bigRelaxTimer.needsNotify)
      ) {
        showNotification("Relax done");
      }
      resetToDefaultTime(relaxTimer, setRelaxTimer);
      resetToDefaultTime(bigRelaxTimer, setBigRelaxTimer);
      if (
        (relaxType === 2 && bigRelaxTimer.needsOver) ||
        (relaxType === 1 && relaxTimer.needsOver)
      ) {
        resetOverTime();
        setStatus(pomodoroStatuses.relax_over_running);
      } else if (
        (relaxType === 2 && !bigRelaxTimer.needsStop) ||
        (relaxType === 1 && !relaxTimer.needsStop)
      ) {
        setStatus(pomodoroStatuses.work_running);
      }
    }
    // 0 - не отдых
    // 1 - обычный отдых
    // 2 - большой отдых
    // setRelaxType(
    //   status === 3 || (status >= 5 && status <= 8)
    //     ? bigRelaxTimer.initSeconds > 0 &&
    //       workTimer.count > 0 &&
    //       workTimer.count % bigRelaxTimer.period === 0
    //       ? 2
    //       : 1
    //     : 0
    // );
    // необходимо следить только за статусом
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const updateDisplayTimeToRelax = () => {
    if (relaxType === 2) {
      updateDisplayTime(bigRelaxTimer.seconds);
    } else {
      updateDisplayTime(relaxTimer.seconds);
    }
  };
  // обновление displayTimer
  useEffect(() => {
    // * если остановились полностью (0),
    //    то необходимо проставить рабочее время
    // * если в рабочем таймере (1 идет, 2 пауза),
    //    то необходимо проставить рабочее время
    // * если остановили рабочее время (3), то необходимо проставить:
    //    - время просрочки, если оно необходимо
    //    - время отдыха, если оно есть и не нужно время просрочки
    //    - ... иначе рабочее время
    // * если в таймере отдыха (5 идет, 6 пауза), то необходимо проставить:
    //    - отдых, если relaxType = 1
    //    - большой отдых, если relaxType = 2
    // * если остановили время отдыха (7), то необходимо проставить:
    //    - время просрочки, если оно необходимо
    //    - ... иначе рабочее время
    // * если время просрочки (4 рабочее, 8 отдых),
    //    то необходимо проставить время просрочки
    if (status === 0) {
      updateDisplayTime(workTimer.seconds);
    } else if (status === 1 || status === 2) {
      updateDisplayTime(workTimer.seconds);
    } else if (status === 3) {
      if (workTimer.needsOver) {
        updateDisplayTime(overTime.seconds);
      } else if (relaxTimer.initSeconds > 0) {
        updateDisplayTimeToRelax();
      } else {
        updateDisplayTime(workTimer.seconds);
      }
    } else if (status === 5 || status === 6) {
      updateDisplayTimeToRelax();
    } else if (status === 7) {
      if (relaxTimer.needsOver) {
        updateDisplayTime(overTime.seconds);
      } else {
        updateDisplayTime(workTimer.seconds);
      }
    } else if (status === 4 || status === 8) {
      updateDisplayTime(overTime.seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workTimer, relaxTimer, bigRelaxTimer, overTime]);
  // обновление tab title
  useEffect(() => {
    const { hours, minutes, seconds } = displayTimer;
    const time =
      `${getTimeNum(hours)}` +
      `:${getTimeNum(minutes)}` +
      `:${getTimeNum(seconds)}`;

    const labels = {
      0: "Stopped",
      1: `Work ${time}`,
      2: `Work paused ${time}`,
      3: "Stopped",
      4: `Work over ${time}`,
      5: `Relax ${time}`,
      6: `Relax paused ${time}`,
      7: "Stopped",
      8: `Relax over ${time}`,
    };

    document.title = labels[status];
  }, [status, displayTimer]);

  const stopWork = () => {
    setWorkTimer((prev) => ({
      ...prev,
      count: prev.count + 1,
    }));
    setStatus(pomodoroStatuses.work_stopped);
  };
  const stopRelax = () => {
    if (relaxType === 2) {
      setBigRelaxTimer((prev) => ({
        ...prev,
        count: prev.count + 1,
      }));
    } else {
      setRelaxTimer((prev) => ({
        ...prev,
        count: prev.count + 1,
      }));
    }
    setStatus(pomodoroStatuses.relax_stopped);
  };

  const timerTick = (timer, setTimer) => {
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
      const isFinished = timerTick(workTimer, setWorkTimer);
      if (isFinished) {
        stopWork();
      }
    },
    status === pomodoroStatuses.work_running ? 1000 : null
  );
  // relax tick
  useInterval(
    () => {
      if (timerTick(relaxTimer, setRelaxTimer)) {
        stopRelax();
      }
    },
    status === pomodoroStatuses.relax_running && relaxType === 1 ? 1000 : null
  );
  // big relax tick
  useInterval(
    () => {
      if (timerTick(bigRelaxTimer, setBigRelaxTimer)) {
        stopRelax();
      }
    },
    status === pomodoroStatuses.relax_running && relaxType === 2 ? 1000 : null
  );
  // over tick
  useInterval(
    () => {
      const seconds = overTime.seconds + 1;
      setOverTime((prev) => ({
        ...prev,
        seconds,
      }));
      let type;
      if (
        status === pomodoroStatuses.work_over_running &&
        workTimer.needsNotify &&
        seconds % workTimer.overSeconds === 0
      ) {
        type = "Work";
      } else if (
        status === pomodoroStatuses.relax_over_running &&
        ((relaxType === 1 &&
          relaxTimer.needsNotify &&
          seconds % workTimer.overSeconds === 0) ||
          (relaxType === 2 &&
            bigRelaxTimer.needsNotify &&
            seconds % bigRelaxTimer.overSeconds === 0))
      ) {
        type = "Relax";
      }
      if (type) {
        const time = transSecsToTime(seconds);
        const sTime =
          `${time.hours ? time.hours + "h " : ""}` +
          `${time.minutes ? time.minutes + "m " : ""}` +
          `${time.seconds}s`;
        showNotification(`${type} over ${sTime} ago`);
      }
    },
    status === pomodoroStatuses.work_over_running ||
      status === pomodoroStatuses.relax_over_running
      ? 1000
      : null
  );

  // button handlers
  const handleStartWorkBtn = () => {
    setStatus(pomodoroStatuses.work_running);
    updateDisplayTime(workTimer.seconds);
  };
  const handlePauseWorkBtn = () => {
    setStatus(pomodoroStatuses.work_paused);
  };
  const handleStopWorkBtn = () => {
    setWorkTimer((prev) => ({ ...prev, needsOver: false }));
    stopWork();
  };
  const handleStartRelaxBtn = () => {
    setStatus(pomodoroStatuses.relax_running);
    updateDisplayTimeToRelax();
  };
  const handlePauseRelaxBtn = () => {
    setStatus(pomodoroStatuses.relax_paused);
  };
  const handleStopRelaxBtn = () => {
    if (relaxType === 1) {
      setRelaxTimer((prev) => ({ ...prev, needsOver: false }));
    } else if (relaxType === 2) {
      setBigRelaxTimer((prev) => ({ ...prev, needsOver: false }));
    }
    stopRelax();
  };
  const handleStopBtn = () => {
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
      <div className="pomodoro-timer__settings-btn">{settingsBtnComponent}</div>
      <div className="pomodoro-timer__status">
        {timerName} {statusNameFactory[status]}
      </div>
      <Clock
        readOnly={true}
        hours={displayTimer.hours}
        minutes={displayTimer.minutes}
        seconds={displayTimer.seconds}
      />
      <PomodoroButtons
        status={status}
        onStartWorkBtn={handleStartWorkBtn}
        onPauseWorkBtn={handlePauseWorkBtn}
        onStartRelaxBtn={handleStartRelaxBtn}
        onPauseRelaxBtn={handlePauseRelaxBtn}
        onStopWorkBtn={handleStopWorkBtn}
        onStopRelaxBtn={handleStopRelaxBtn}
        onStopBtn={handleStopBtn}
      />
      <div className="pomodoro-timer__settings">{settingsComponent}</div>
    </div>
  );
};

export default PomodoroTimer;
