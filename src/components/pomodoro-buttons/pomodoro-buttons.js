import React from "react";
import { Button } from "react-bootstrap";

import "./styles.scss";

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

export default PomodoroButtons;
