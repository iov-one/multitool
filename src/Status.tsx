import { FullSignature, SendTransaction, SignedTransaction, TransactionId, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ConditionalError from "./ConditionalError";
import SignaturesList from "./SignaturesList";
import Transaction from "./Transaction";
import { postSignedTransaction } from "./util/connection";
import { getErrorMessage } from "./util/errors";
import { fromLinkEncoded, makeSigningLink } from "./util/links";
import { fromPrintableSignature, makeSignedTransaction } from "./util/signatures";

const { toHex } = Encoding;

interface StatusProps {}

interface StatusState {
  readonly original: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> | null;
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
      original: null,
      signatures: [],
      localSignature: "",
      posting: false,
    };
  }

  public componentDidMount(): void {
    if (!this.state.original) {
      const matches = window.location.href.match(/\/status\/([-_=a-zA-Z0-9]+)/);
      if (matches && matches.length >= 2) {
        try {
          const signedTransaction = fromLinkEncoded(matches[1]);
          const { primarySignature, otherSignatures } = signedTransaction;
          this.setState({
            original: signedTransaction,
            signatures: [primarySignature, ...otherSignatures],
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
            {this.state.original && <Transaction transaction={this.state.original.transaction} />}
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
                  this.setState({ addSignatureError: undefined });

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
                    this.setState({ addSignatureError: getErrorMessage(error) });
                  }
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

  private postToChain(): void {
    if (!this.state.original) throw new Error("Original transaction not set");
    const signed = makeSignedTransaction(this.state.original.transaction, this.state.signatures);

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
