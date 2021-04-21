import React, { useEffect, useState } from "react";
import useInterval from "../../hooks/useInterval";
import {
  transformSecsToTime,
  transformTimeToSecs,
} from "../../utils/timeTransform";
import Clock from "../clock";
import { watchStatuses as statuses } from "../../constants";

export default function Watch(props) {
  const [hours, setHours] = useState(props.hours ? props.hours : 0);
  const [minutes, setMinutes] = useState(props.minutes ? props.minutes : 0);
  const [seconds, setSeconds] = useState(props.seconds ? props.seconds : 0);

  useEffect(() => {
    if (props.status === statuses.s) {
      setHours(props.hours ? props.hours : 0);
      setMinutes(props.minutes ? props.minutes : 0);
      setSeconds(props.seconds ? props.seconds : 0);
    }
  }, [props.hours, props.minutes, props.seconds, props.status]);

  useInterval(() => handleTick(), props.status === statuses.r ? 1000 : null);

  const handleTick = () => {
    const secs = transformTimeToSecs(hours, minutes, seconds);
    const time = transformSecsToTime(secs + 1);

    setHours(time.hours);
    setMinutes(time.minutes);
    setSeconds(time.seconds);

    if (props.notifyAfterSecs) {
      if (secs > 0 && secs % props.notifyAfterSecs === 0) {
        showNotification();
      }
    }
  };

  const showNotification = () => {
    const options = {
      body: `Таймер прозвенел ${hours}ч. ${minutes}м. ${seconds}с. назад`,
      dir: "ltr",
    };
    new Notification("Таймер", options);
  };

  return (
    <Clock readOnly={true} hours={hours} minutes={minutes} seconds={seconds} />
  );
}
