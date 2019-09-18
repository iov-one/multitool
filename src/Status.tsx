import { FullSignature, SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import SignaturesList from "./SignaturesList";
import { postSignedTransaction } from "./util/connection";
import { prettyPrintJson } from "./util/json";
import { fromLinkEncoded, makeSigningLink } from "./util/links";
import { fromPrintableSignature, makeSignedTransaction } from "./util/signatures";

const { toHex } = Encoding;

interface StatusProps {}

interface StatusState {
  readonly original: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
  readonly addSignatureError: string;
}

class Status extends React.Component<StatusProps, StatusState> {
  public constructor(props: StatusProps) {
    super(props);
    this.state = {
      original: null,
      signatures: [],
      localSignature: "",
      addSignatureError: "",
    };
  }

  public componentDidMount(): void {
    if (!this.state.original) {
      const matches = window.location.href.match(/\/status\/([-_=a-zA-Z0-9]+)/);
      if (matches && matches.length >= 2) {
        const signedTransaction = fromLinkEncoded(matches[1]);
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
                rows={3}
                value={this.state.original ? makeSigningLink(this.state.original, true) : ""}
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
                ? prettyPrintJson(TransactionEncoder.toJson(this.state.original.transaction))
                : ""}
            </pre>
          </Col>
          <Col className="col-6">
            <h2>Signatures ({this.state.signatures.length})</h2>
            {this.state.original && (
              <SignaturesList
                chainId={this.state.original.transaction.creator.chainId}
                signatures={this.state.signatures}
              />
            )}

            <p>
              <button
                className="btn btn-primary btn-sm"
                onClick={event => {
                  event.preventDefault();
                  this.setState({ addSignatureError: "" });

                  const signature = prompt("Please enter signature");
                  if (signature === null) return;

                  try {
                    console.log(signature);
                    const fullSignature = fromPrintableSignature(signature);

                    const existingPubkeys = this.state.signatures.map(sig => toHex(sig.pubkey.data));
                    if (existingPubkeys.find(pubkeyHex => pubkeyHex === toHex(fullSignature.pubkey.data))) {
                      throw new Error("Signature of this account already included");
                    }

                    this.setState({
                      signatures: [...this.state.signatures, fullSignature],
                    });
                  } catch (error) {
                    console.info("Full error message", error);
                    const errorMessage = error instanceof Error ? error.message : error.toString();
                    this.setState({ addSignatureError: errorMessage });
                  }
                }}
              >
                Add signature
              </button>
            </p>

            <Alert hidden={!this.state.addSignatureError} variant="danger">
              {this.state.addSignatureError}
            </Alert>

            <h2>Post to blockchain</h2>
            <p>The transaction with all signatures from above will be posted to the IOV blockchain.</p>
            <p>
              <button
                className="btn btn-primary"
                onClick={event => {
                  event.preventDefault();
                  this.postToChain();
                }}
              >
                Post now
              </button>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    );
  }

  private postToChain(): void {
    if (!this.state.original) throw new Error("Original transaction not set");
    const signed = makeSignedTransaction(this.state.original.transaction, this.state.signatures);
    postSignedTransaction(signed).then(
      transactionId => {
        console.log("Successfully posted", transactionId);
      },
      error => console.error(error),
    );
  }
}

export default Status;
