import React, { useState } from "react";
import { Button } from "react-bootstrap";

import SettingsPosition from "../settings-position/settings-position";

import "./styles.scss";

const Settings = ({
  onSaveClick,
  workTimerSettings,
  relaxTimerSettings,
  bigRelaxTimerSettings,
}) => {
  const [workSettings, setWorkSettings] = useState({
    seconds: workTimerSettings.seconds,
    needsOver: workTimerSettings.needsOver,
    needsStop: workTimerSettings.needsStop,
    needsNotify: workTimerSettings.needsNotify,
    overSeconds: workTimerSettings.overSeconds,
  });
  const [relaxSettings, setRelaxSettings] = useState({
    seconds: relaxTimerSettings.seconds,
    needsOver: relaxTimerSettings.needsOver,
    needsStop: relaxTimerSettings.needsStop,
    needsNotify: relaxTimerSettings.needsNotify,
    overSeconds: relaxTimerSettings.overSeconds,
  });
  const [bigRelaxSettings, setBigRelaxSettings] = useState({
    seconds: bigRelaxTimerSettings.seconds,
    needsOver: bigRelaxTimerSettings.needsOver,
    needsStop: bigRelaxTimerSettings.needsStop,
    needsNotify: bigRelaxTimerSettings.needsNotify,
    overSeconds: bigRelaxTimerSettings.overSeconds,
    needed: bigRelaxTimerSettings.needed,
    period: bigRelaxTimerSettings.period,
  });

  const handleOnTimerChange = (seconds, setSettings) => {
    setSettings((prev) => ({ ...prev, seconds }));
  };
  const handleOnOverTimerChange = (overSeconds, setSettings) => {
    setSettings((prev) => ({ ...prev, overSeconds }));
  };
  const handleOnSwitchChange = (e, type, setSettings) => {
    const checked = e.target.checked;
    switch (type) {
      case "needsOver":
        setSettings((prev) => ({ ...prev, needsOver: checked }));
        break;
      case "needsNotify":
        setSettings((prev) => ({ ...prev, needsNotify: checked }));
        break;
      case "needsStop":
        setSettings((prev) => ({ ...prev, needsStop: checked }));
        break;
      default:
        return;
    }
  };

  const handleOnSaveClick = () => {
    onSaveClick({
      workTimerSettings: workSettings,
      relaxTimerSettings: relaxSettings,
      bigRelaxTimerSettings: bigRelaxSettings,
    });
  };

  const workClock = !workSettings ? null : (
    <div>
      <SettingsPosition
        seconds={workSettings.seconds}
        overSeconds={workSettings.overSeconds}
        needsOver={workSettings.needsOver}
        needsStop={workSettings.needsStop}
        needsNotify={workSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setWorkSettings)}
        onOverTimeChange={(s) => handleOnOverTimerChange(s, setWorkSettings)}
        onSwitchChange={(e, t) => handleOnSwitchChange(e, t, setWorkSettings)}
        settingName="Working timer"
      />
      <SettingsPosition
        seconds={relaxSettings.seconds}
        overSeconds={relaxSettings.overSeconds}
        needsOver={relaxSettings.needsOver}
        needsStop={relaxSettings.needsStop}
        needsNotify={relaxSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setRelaxSettings)}
        onOverTimeChange={(s) => handleOnOverTimerChange(s, setRelaxSettings)}
        onSwitchChange={(e, t) => handleOnSwitchChange(e, t, setRelaxSettings)}
        settingName="Relax timer"
      />
      <SettingsPosition
        seconds={bigRelaxSettings.seconds}
        overSeconds={bigRelaxSettings.overSeconds}
        needsOver={bigRelaxSettings.needsOver}
        needsStop={bigRelaxSettings.needsStop}
        needsNotify={bigRelaxSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setBigRelaxSettings)}
        onOverTimeChange={(s) =>
          handleOnOverTimerChange(s, setBigRelaxSettings)
        }
        onSwitchChange={(e, t) =>
          handleOnSwitchChange(e, t, setBigRelaxSettings)
        }
        settingName="Big relax timer"
      />
    </div>
  );

  return (
    <div className="settings">
      <div className="settings__title">Settings</div>
      {workClock}
      <Button onClick={handleOnSaveClick}>Save</Button>
    </div>
  );
};

export default Settings;
