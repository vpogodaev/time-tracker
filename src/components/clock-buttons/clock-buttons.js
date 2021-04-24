import { Button } from "react-bootstrap";
import React from "react";

import "./styles.scss";

export default function ClockButtons(props) {
  const start = (
    <Button key={1} onClick={props.onStartBtn}>
      Start
    </Button>
  );
  const pause = (
    <Button key={2} onClick={props.onPauseBtn}>
      Pause
    </Button>
  );
  const stop = (
    <Button key={3} onClick={props.onStopBtn}>
      Stop
    </Button>
  );

  function wrap(buttons) {
    return <div className="buttons-wrapper">{buttons}</div>;
  }

  const buttonFactory = {
    stopped: wrap([start]),
    finished: wrap([start]),
    running: wrap([pause]),
    paused: wrap([start, stop]),
    over: wrap([stop]),
  };

  return buttonFactory[props.status]
    ? buttonFactory[props.status]
    : wrap(<div></div>);
}
