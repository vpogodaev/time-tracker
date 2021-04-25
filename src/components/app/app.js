import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

// import Watch from "../watch";
// import ContinuousTimer from "../continuous-timer";
// import Timer from "../timer/timer";
import PomodoroTimerWrapper from "../pomodoro-timer-wrapper";

import "./styles.scss";

export default function App() {
  useEffect(() => {
    console.log('Notification permission ask');
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
          <PomodoroTimerWrapper />
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
