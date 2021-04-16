import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

import ContinuousTimer from "../continuous-timer";

import "./styles.scss";

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <ContinuousTimer />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
