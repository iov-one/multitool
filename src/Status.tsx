import { FullSignature, SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { makeSigningLink } from "./links";
import {
  fromPrintableSignature,
  isSignedMultisignatureSendTransaction,
  toPrintableSignature,
} from "./signatures";

const { fromHex, toHex } = Encoding;

interface StatusProps {}

interface StatusState {
  readonly original: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
}

class Status extends React.Component<StatusProps, StatusState> {
  public constructor(props: StatusProps) {
    super(props);
    this.state = {
      original: null,
      signatures: [],
      localSignature: "",
    };
  }

  public componentDidMount(): void {
    if (!this.state.original) {
      const matches = window.location.href.match(/\/status\/([a-f0-9]+)/);
      if (matches && matches.length >= 2) {
        const payload = fromHex(matches[1]);
        console.log(`Got payload of ${payload.length} bytes`);
        const signedTransaction = TransactionEncoder.fromJson(JSON.parse(Encoding.fromUtf8(payload)));
        if (!isSignedMultisignatureSendTransaction(signedTransaction)) {
          throw new Error(
            "Transaction data is not an SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>",
          );
        }

        const { primarySignature, otherSignatures } = signedTransaction;
        this.setState({
          original: signedTransaction,
          signatures: [primarySignature, ...otherSignatures],
        });
      }
    }
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Signing link</h2>

            <div className="form-group">
              <label htmlFor="signingLink">
                Send this link to every user supposed to sign this transaction
              </label>
              <textarea
                className="form-control"
                id="signingLink"
                rows={1}
                value={this.state.original ? makeSigningLink(this.state.original) : ""}
                readOnly={true}
              ></textarea>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="col-6">
            <h2>Review transaction</h2>
            <pre>
              {this.state.original
                ? JSON.stringify(TransactionEncoder.toJson(this.state.original.transaction), null, 2)
                : ""}
            </pre>
          </Col>
          <Col className="col-6">
            <h2>Signatures</h2>
            <ol>
              {this.state.signatures.map(signature => (
                <li key={toHex(signature.signature)}>
                  <code>{toPrintableSignature(signature)}</code>
                </li>
              ))}
            </ol>
            <button
              className="btn btn-link btn-sm"
              onClick={event => {
                event.preventDefault();
                const signature = prompt("Please enter signature");
                if (signature) {
                  try {
                    console.log(signature);
                    const fullSignature = fromPrintableSignature(signature);

                    this.setState({
                      signatures: [...this.state.signatures, fullSignature],
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
            >
              Add
            </button>
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    );
  }
}

export default Status;
