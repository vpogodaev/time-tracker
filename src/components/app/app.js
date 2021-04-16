import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Timer from "../timer";

import "./styles.scss";

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Timer />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
