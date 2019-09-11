import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface StartProps {}

interface StartState {
  readonly formSender: string;
  readonly formRecipient: string;
}

type FormField = "sender" | "recipient";

class Start extends React.Component<StartProps, StartState> {
  public constructor(props: StartProps) {
    super(props);
    this.state = {
      formSender: "",
      formRecipient: "",
    };
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col>
            <h3>Hello, world</h3>

            <input
              type="text"
              placeholder="Sender"
              value={this.state.formSender}
              onChange={e => this.handleFormChange("sender", e)}
            />
            <input
              type="text"
              placeholder="Recipient"
              value={this.state.formRecipient}
              onChange={e => this.handleFormChange("recipient", e)}
            />
          </Col>
        </Row>
      </Container>
    );
  }

  private handleFormChange(field: FormField, event: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = event.target.value;

    switch (field) {
      case "sender":
        this.setState({ formSender: newValue });
        break;
      case "recipient":
        this.setState({ formRecipient: newValue });
        break;
    }
  }
}

export default Start;
