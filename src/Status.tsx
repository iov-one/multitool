import { FullSignature, SendTransaction, TransactionId } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ConditionalError from "./ConditionalError";
import SignaturesList from "./SignaturesList";
import Transaction from "./Transaction";
import { arrayEquals } from "./util/arrays";
import { postSignedTransaction } from "./util/connection";
import { getErrorMessage } from "./util/errors";
import { makeSigningLink, signedFromLinkEncoded } from "./util/links";
import { fromPrintableSignature, makeSignedTransaction, verifySignature } from "./util/signatures";

interface StatusProps {}

interface StatusState {
  readonly transaction: (SendTransaction & MultisignatureTx) | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
  readonly addSignatureError?: string;
  readonly posting: boolean;
  readonly postError?: string;
  readonly postSuccess?: TransactionId;
  readonly globalError?: string;
}

class Status extends React.Component<StatusProps, StatusState> {
  public constructor(props: StatusProps) {
    super(props);
    this.state = {
      transaction: null,
      signatures: [],
      localSignature: "",
      posting: false,
    };
  }

  public componentDidMount(): void {
    if (!this.state.transaction) {
      const matches = window.location.href.match(/\/status\/([-_=a-zA-Z0-9]+)/);
      if (matches && matches.length >= 2) {
        try {
          const signedTransaction = signedFromLinkEncoded(matches[1]);
          const { transaction, signatures } = signedTransaction;
          this.setState({
            transaction: transaction,
            signatures: signatures,
          });
        } catch (error) {
          console.warn("Full error message", error);
          this.setState({ globalError: "Error in URL: " + getErrorMessage(error) });
        }
      } else {
        this.setState({ globalError: "Error in URL: Transaction missing" });
      }
    }
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col>
            <ConditionalError error={this.state.globalError} />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Signing link</h2>

            <div className="form-group">
              <label htmlFor="signingLink">
                Send this link to every user supposed to sign this transaction
              </label>
              <input
                className="form-control"
                id="signingLink"
                value={this.state.transaction ? makeSigningLink(this.state.transaction, true) : ""}
                readOnly={true}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="col-6">
            <h2>Review transaction</h2>
            {this.state.transaction && <Transaction transaction={this.state.transaction} />}
          </Col>
          <Col className="col-6">
            <h2>Signatures</h2>
            {this.state.transaction && (
              <SignaturesList chainId={this.state.transaction.chainId} signatures={this.state.signatures} />
            )}

            <p>
              <button
                className="btn btn-primary btn-sm"
                onClick={event => {
                  event.preventDefault();
                  this.addSignature();
                }}
              >
                Add signature
              </button>
            </p>
            <ConditionalError error={this.state.addSignatureError} />

            <h2>Post to blockchain</h2>
            <div hidden={!!this.state.postSuccess}>
              <p>The transaction with all signatures from above will be posted to the IOV blockchain.</p>
              <p>
                <button
                  className="btn btn-primary"
                  disabled={this.state.posting}
                  onClick={event => {
                    event.preventDefault();
                    this.postToChain();
                  }}
                >
                  Post now
                </button>
              </p>
            </div>
            <Alert variant="success" hidden={!this.state.postSuccess}>
              <p>Sucessfully posted transaction with ID {this.state.postSuccess} to the blockchain.</p>
            </Alert>
            <ConditionalError error={this.state.postError} />
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    );
  }

  private async addSignature(): Promise<void> {
    if (!this.state.transaction) throw new Error("Original transaction not set");

    this.setState({ addSignatureError: undefined });

    const signatureInput = prompt("Please enter signature");
    if (signatureInput === null) return;

    try {
      const newSignature = fromPrintableSignature(signatureInput);

      if (!(await verifySignature(this.state.transaction, newSignature))) {
        throw new Error("Signature is not valid for this transaction");
      }

      const existing = this.state.signatures.map(fullSignature => fullSignature.signature);
      if (existing.find(signature => arrayEquals(signature, newSignature.signature))) {
        throw new Error("This signature is already included");
      }

      /** signatures by other accounts */
      const otherSignatures = this.state.signatures.filter(
        signature => !arrayEquals(signature.pubkey.data, newSignature.pubkey.data),
      );

      this.setState({
        signatures: [...otherSignatures, newSignature],
      });
    } catch (error) {
      console.info("Full error message", error);
      this.setState({ addSignatureError: getErrorMessage(error) });
    }
  }

  private postToChain(): void {
    if (!this.state.transaction) throw new Error("Original transaction not set");
    const signed = makeSignedTransaction(this.state.transaction, this.state.signatures);

    this.setState({
      posting: true,
      postError: undefined,
    });
    postSignedTransaction(signed).then(
      transactionId => {
        console.log("Successfully posted", transactionId);
        this.setState({
          posting: false,
          postError: undefined,
          postSuccess: transactionId,
        });
      },
      error => {
        console.info("Full error message", error);
        this.setState({
          posting: false,
          postError: getErrorMessage(error),
        });
      },
    );
  }
}

export default Status;
