import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Watch from "../watch";
import ContinuousTimer from "../continuous-timer";
import Timer from "../timer/timer";

import "./styles.scss";
import PomodoroTimer from "../pomodoro-timer";

export default function App() {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("notifications disabled");
    } else {
      Notification.requestPermission();
    }
  });

  //const now = new Date();
  return (
    <Container>
      <Row>
        <Col>
          <PomodoroTimer />
          {/* <Watch
            hours={now.getHours()}
            minutes={now.getMinutes()}
            seconds={now.getSeconds()}
          /> */}
          {/* <Timer /> */}
          {/* <ContinuousTimer /> */}
        </Col>
      </Row>
    </Container>
  );
}
