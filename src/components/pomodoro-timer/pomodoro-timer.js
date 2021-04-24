import { Button, Form } from "react-bootstrap";
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

const Settings = ({ workSettings }) => {
  const workClock = !workSettings ? null : (
    <div>
      <div>Working timer:</div>
      <Clock
        readOnly={false}
        hours={workSettings.hours}
        minutes={workSettings.minutes}
        seconds={workSettings.seconds}
        onTimeChange={workSettings.onTimeChange}
      />
      <Form.Check
        type="switch"
        label="Needs over"
        id="workTimerNeedsOver"
        checked={workSettings.needsOver}
        onChange={workSettings.onNeedsOverChange}
      />
      <Form.Check
        type="switch"
        label="Needs stop"
        id="workTimerNeedsStop"
        checked={workSettings.needsStop}
        onChange={workSettings.onNeedsStopChange}
      />
      <Form.Check
        type="switch"
        label="Needs notify"
        id="workTimerNeedsNotify"
        checked={workSettings.needsNotify}
        onChange={workSettings.onNeedsNotifyChange}
      />
      Over notify in
      <Clock
        readOnly={false}
        hours={transformSecsToTime(workSettings.overNoifyInSecs).hours}
        minutes={transformSecsToTime(workSettings.overNoifyInSecs).minutes}
        seconds={transformSecsToTime(workSettings.overNoifyInSecs).seconds}
        onTimeChange={workSettings.onOverNotifyInSecsChange}
      />
    </div>
  );

  return (
    <div>
      <div>Settings:</div>
      {workClock}
    </div>
  );
};

export const PomodoroTimerWrapper = () => {
  const [showSettings, setShowSettings] = useState(true);
  const [workSettings, setworkSettings] = useState({
    hours: 0,
    minutes: 0,
    seconds: 30,
    needsNotify: true,
    needsStop: false,
    overNoifyInSecs: 10,
    needsOver: true,
    onTimeChange: (h, m, s) => handleTimeChange(h, m, s, setworkSettings),
    onNeedsOverChange: (e) =>
      handleCheckBoxChange(e, "needsOver", setworkSettings),
    onNeedsNotifyChange: (e) =>
      handleCheckBoxChange(e, "needsNotify", setworkSettings),
    onNeedsStopChange: (e) =>
      handleCheckBoxChange(e, "needsStop", setworkSettings),
    onOverNotifyInSecsChange: (h, m, s) =>
      handleOverNotifyInSecsChange(h, m, s, setworkSettings),
  });

  const handleSettingsButton = () => {
    setShowSettings(!showSettings);
  };
  const handleTimeChange = (hours, minutes, seconds, setClock) => {
    setClock((prev) => ({ ...prev, hours, minutes, seconds }));
  };
  const handleCheckBoxChange = (e, type, setTimer) => {
    const checked = e.target.checked;
    switch (type) {
      case "needsOver":
        setTimer((prev) => ({ ...prev, needsOver: checked }));
        break;
      case "needsNotify":
        setTimer((prev) => ({ ...prev, needsNotify: checked }));
        break;
      case "needsStop":
        setTimer((prev) => ({ ...prev, needsStop: checked }));
        break;
      default:
        return;
    }
  };
  const handleOverNotifyInSecsChange = (hours, minutes, seconds, setClock) => {
    const overNoifyInSecs = transformTimeToSecs(hours, minutes, seconds);
    setClock((prev) => ({ ...prev, overNoifyInSecs }));
  };

  const settings = !showSettings ? null : (
    <Settings workSettings={workSettings} />
  );

  return (
    <PomodoroTimer
      settingsComponent={settings}
      settingsBtnComponent={
        <Button onClick={handleSettingsButton}>Settings</Button>
      }
      workSettings={workSettings}
    />
  );
};

const PomodoroButtons = ({
  status,
  onStartWorkBtn,
  onPauseWorkBtn,
  onStopWorkBtn,
  onStartRelaxBtn,
  onPauseRelaxBtn,
  onStopRelaxBtn,
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
    getButton("Stop work", 3, onStopWorkBtn, disabled);
  const startRelax = (disabled) =>
    getButton("Start relax", 4, onStartRelaxBtn, disabled);
  const pauseRelax = (disabled) =>
    getButton("Pause relax", 5, onPauseRelaxBtn, disabled);
  const stopRelax = (disabled) =>
    getButton("Stop relax", 6, onStopRelaxBtn, disabled);

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

const PomodoroTimer = ({
  settingsBtnComponent,
  settingsComponent,
  workSettings,
}) => {
  const [workTimer, setWorkTimer] = useState({
    seconds: 0,
    initSeconds: !workSettings
      ? 10
      : transformTimeToSecs(
          workSettings.hours,
          workSettings.minutes,
          workSettings.seconds
        ),
    count: 0,
    needsNotify: !workSettings ? true : workSettings.needsNotify,
    needsStop: !workSettings ? true : workSettings.needsStop,
    overNoifyInSecs: !workSettings ? 30 : workSettings.overNoifyInSecs,
    needsOver: true,
    initNeedsOver: !workSettings ? true : workSettings.needsOver,
  });
  const [relaxTimer, setRelaxTimer] = useState({
    seconds: 0,
    initSeconds: 2,
    count: 0,
    needsNotify: false,
    needsStop: false,
    overNoifyInSecs: -1,
    needsOver: true,
    initNeedsOver: true,
  });
  const [bigRelaxTimer, setBigRelaxTimer] = useState({
    seconds: 0,
    initSeconds: 3,
    count: 0,
    needsNotify: false,
    needsStop: false,
    overNoifyInSecs: -1,
    needsOver: false,
    initNeedsOver: true,
    period: 2,
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
  useEffect(() => {
    console.log(workSettings);
    //setStatus(pomodoroStatuses.stopped);
    const initSecs = transformTimeToSecs(
      workSettings.hours,
      workSettings.minutes,
      workSettings.seconds
    );
    setWorkTimer({
      seconds: 0,
      initSeconds: !workSettings ? 10 : initSecs,
      count: 0,
      needsNotify: !workSettings ? true : workSettings.needsNotify,
      needsStop: !workSettings ? true : workSettings.needsStop,
      overNoifyInSecs: !workSettings ? 30 : workSettings.overNoifyInSecs,
      needsOver: !workSettings ? true : workSettings.needsOver,
      initNeedsOver: !workSettings ? true : workSettings.needsOver,
    });
    resetToDefaultTime(workTimer, setWorkTimer);
  }, [workSettings]);

  //const [relaxType, setRelaxType] = useState(0);
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
    const { hours, minutes, seconds } = transformSecsToTime(secs);
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
        seconds % workTimer.overNoifyInSecs === 0
      ) {
        type = "Work";
      } else if (
        status === pomodoroStatuses.relax_over_running &&
        ((relaxType === 1 &&
          relaxTimer.needsNotify &&
          seconds % workTimer.overNoifyInSecs === 0) ||
          (relaxType === 2 &&
            bigRelaxTimer.needsNotify &&
            seconds % bigRelaxTimer.overNoifyInSecs === 0))
      ) {
        type = "Relax";
      }
      if (type) {
        const time = transformSecsToTime(seconds);
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
