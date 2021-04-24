import React, { useState } from "react";
import { Button } from "react-bootstrap";

import PomodoroTimer from "../pomodoro-timer";
import Settings from "../settings";

import "./styles.scss";

const PomodoroTimerWrapper = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [workSettings, setWorkSettings] = useState({
    seconds: 15,
    overSeconds: 10,
    needsNotify: true,
    needsStop: false,
    needsOver: true,
  });
  const [relaxSettings, setRelaxSettings] = useState({
    seconds: 5,
    overSeconds: 10,
    needsNotify: true,
    needsStop: false,
    needsOver: true,
  });
  const [bigRelaxSettings, setBigRelaxSettings] = useState({
    seconds: 10,
    overSeconds: 10,
    needsNotify: true,
    needsStop: false,
    needsOver: true,
    needed: true,
    period: 2,
  });

  const handleSettingsButton = () => {
    setShowSettings(!showSettings);
  };

  const save = (from, set) => {
    console.log(from);
    const { seconds, overSeconds, needsNotify, needsStop, needsOver } = from;

    set({
      seconds,
      overSeconds,
      needsNotify,
      needsStop,
      needsOver,
    });
  };

  const handleOnSaveClick = ({
    workTimerSettings,
    relaxTimerSettings,
    bigRelaxTimerSettings,
  }) => {
    save(workTimerSettings, setWorkSettings);
    save(relaxTimerSettings, setRelaxSettings);
    save(bigRelaxTimerSettings, setBigRelaxSettings);
  };

  const settings = !showSettings ? null : (
    <Settings
      onSaveClick={handleOnSaveClick}
      workTimerSettings={workSettings}
      relaxTimerSettings={relaxSettings}
      bigRelaxTimerSettings={bigRelaxSettings}
    />
  );

  return (
    <PomodoroTimer
      settingsComponent={settings}
      settingsBtnComponent={
        <Button onClick={handleSettingsButton}>Settings</Button>
      }
      workSettings={workSettings}
      relaxSettings={relaxSettings}
      bigRelaxSettings={bigRelaxSettings}
    />
  );
};

export default PomodoroTimerWrapper;
