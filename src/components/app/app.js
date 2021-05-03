import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import PomodoroTimerWrapper from "../pomodoro-timer-wrapper";

import "./styles.scss";

export default function App() {
  useEffect(() => {
    // notif
    if (!("Notification" in window)) {
      console.log("notifications disabled");
    } else {
      Notification.requestPermission();
    }

    // title
    document.title = "Timer app";
  }, []);

  return <PomodoroTimerWrapper />;
}
