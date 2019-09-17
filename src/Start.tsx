import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

interface StartProps {}

class Start extends React.Component<StartProps, {}> {
  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Multitool</h1>
            <h2>Create multisignatures transactions using Ledger Nano S</h2>
          </Col>
        </Row>
        <Row>
          <Col className=""></Col>
          <Col className="col-4">
            <Link to="/create" className="btn btn-lg btn-block btn-primary">
              Create new transaction
            </Link>
          </Col>
          <Col className=""></Col>
          <Col className="col-4">&nbsp;</Col>
          <Col className=""></Col>
        </Row>
      </Container>
    );
  }
}

export default Start;
