import React from "react";
import { Button } from "react-bootstrap";

import SettingsPosition from "../settings-position/settings-position";

import "./styles.scss";

const Settings = ({
  onSaveClick,
  workSettings,
  setWorkSettings,
  relaxSettings,
  setRelaxSettings,
  bigRelaxSettings,
  setBigRelaxSettings,
}) => {
  const handleOnTimerChange = (seconds, setSettings, settings) => {
    console.log(settings);
    setSettings((prev) => ({ ...prev, seconds }));
  };
  const handleOnOverTimerChange = (overSeconds, setSettings) => {
    setSettings((prev) => ({ ...prev, overSeconds }));
  };
  const handleOnSwitchChange = (e, type, setSettings, settings) => {
    const checked = e.target.checked;
    console.log(settings);
    setSettings((prev) => ({ ...prev, [type]: checked }));
  };

  const handleOnSaveClick = () => {
    onSaveClick({
      workTimerSettings: workSettings,
      relaxTimerSettings: relaxSettings,
      bigRelaxTimerSettings: bigRelaxSettings,
    });
  };

  const workTimerSettings = workSettings && (
    <div>
      <div>Working timer:</div>
      <SettingsPosition
        seconds={workSettings.seconds}
        overSeconds={workSettings.overSeconds}
        needsOver={workSettings.needsOver}
        needsStop={workSettings.needsStop}
        needsNotify={workSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setWorkSettings, workSettings)}
        onOverTimeChange={(s) => handleOnOverTimerChange(s, setWorkSettings)}
        onSwitchChange={(e, t) => handleOnSwitchChange(e, t, setWorkSettings, workSettings)}
      />
    </div>
  );
  const relaxTimerSettings = relaxSettings && (
    <div>
      <div>Relax timer:</div>
      <SettingsPosition
        seconds={relaxSettings.seconds}
        overSeconds={relaxSettings.overSeconds}
        needsOver={relaxSettings.needsOver}
        needsStop={relaxSettings.needsStop}
        needsNotify={relaxSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setRelaxSettings, relaxSettings)}
        onOverTimeChange={(s) => handleOnOverTimerChange(s, setRelaxSettings)}
        onSwitchChange={(e, t) => handleOnSwitchChange(e, t, setRelaxSettings, relaxSettings)}
      />
    </div>
  );
  const bigRelaxTimerSettings = bigRelaxSettings && (
    <div>
      <div>Big relax timer:</div>
      <SettingsPosition
        seconds={bigRelaxSettings.seconds}
        overSeconds={bigRelaxSettings.overSeconds}
        needsOver={bigRelaxSettings.needsOver}
        needsStop={bigRelaxSettings.needsStop}
        needsNotify={bigRelaxSettings.needsNotify}
        onTimeChange={(s) => handleOnTimerChange(s, setBigRelaxSettings, bigRelaxSettings)}
        onOverTimeChange={(s) =>
          handleOnOverTimerChange(s, setBigRelaxSettings)
        }
        onSwitchChange={(e, t) =>
          handleOnSwitchChange(e, t, setBigRelaxSettings, bigRelaxSettings)
        }
      />
    </div>
  );

  return (
    (workTimerSettings || relaxTimerSettings || bigRelaxTimerSettings) && (
      <div>
        <div>Settings:</div>
        {workTimerSettings}
        {relaxTimerSettings}
        {bigRelaxTimerSettings}
        <Button onClick={handleOnSaveClick}>Save</Button>
      </div>
    )
  );
};

export default Settings;
