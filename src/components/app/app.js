import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

//import Watch from "../watch";
import ContinuousTimer from "../continuous-timer";
import Timer from "../timer/timer";

import "./styles.scss";

class App extends Component {
  render() {
    //const now = new Date();

    return (
      <Container>
        <Row>
          <Col>
            {/* <Watch
              hours={now.getHours()}
              minutes={now.getMinutes()}
              seconds={now.getSeconds()}
            /> */}
            {/* <Timer /> */}
            <ContinuousTimer />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
