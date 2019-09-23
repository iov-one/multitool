import { Algorithm, FullSignature, Identity, PubkeyBytes, SendTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ConditionalError from "./ConditionalError";
import { chains } from "./settings";
import Transaction from "./Transaction";
import { getErrorMessage } from "./util/errors";
import { createSignature, getPubkeyFromLedger } from "./util/ledger";
import { fromLinkEncoded } from "./util/links";
import { toPrintableSignature } from "./util/signatures";

interface SignProps {}

interface SignState {
  readonly transaction: (SendTransaction & MultisignatureTx & WithCreator) | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
  readonly signingError?: string;
  readonly globalError?: string;
  readonly signing: boolean;
}

class Sign extends React.Component<SignProps, SignState> {
  public constructor(props: SignProps) {
    super(props);
    this.state = {
      transaction: null,
      signatures: [],
      localSignature: "",
      signing: false,
    };
  }

  public componentDidMount(): void {
    if (!this.state.transaction) {
      const matches = window.location.href.match(/\/sign\/([-_=a-zA-Z0-9]+)/);
      if (matches && matches.length >= 2) {
        try {
          const signedTransaction = fromLinkEncoded(matches[1]);
          const { transaction, primarySignature, otherSignatures } = signedTransaction;
          this.setState({
            transaction: transaction,
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
          <Col className="col-6">
            <h2>Review transaction</h2>
            {this.state.transaction && <Transaction transaction={this.state.transaction} />}
          </Col>
          <Col className="col-6">
            <h2>Create Signature</h2>

            <div className="form-group">
              <label htmlFor="yourSignature">Your signature</label>
              <textarea
                className="form-control"
                id="yourSignature"
                rows={6}
                value={this.state.localSignature}
                readOnly={true}
              ></textarea>
            </div>

            <p>
              <button
                className="btn btn-primary"
                onClick={async event => {
                  event.preventDefault();
                  this.setState({ localSignature: "", signingError: undefined, signing: true });

                  try {
                    const signature = await this.createSignature();
                    this.setState({
                      localSignature: signature,
                      signing: false,
                    });
                  } catch (error) {
                    console.info("Full error message", error);
                    const errorMessage = getErrorMessage(error);
                    this.setState({
                      signingError: errorMessage,
                      signing: false,
                    });
                  }
                }}
              >
                Sign transaction now
              </button>
            </p>

            <Alert hidden={!this.state.signing} variant="info">
              Please sign transaction using Ledger device now
            </Alert>
            <ConditionalError error={this.state.signingError} />
          </Col>
        </Row>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
      </Container>
    );
  }

  private async createSignature(): Promise<string> {
    const original = this.state.transaction;
    if (!original) throw new Error("Transaction not set");

    const chain = chains.get(original.creator.chainId);
    if (!chain) throw new Error("Chain not found");

    const pubkeyResponse = await getPubkeyFromLedger(chain.networkType);

    const signer: Identity = {
      chainId: original.creator.chainId,
      pubkey: {
        algo: Algorithm.Ed25519,
        data: pubkeyResponse.pubkey as PubkeyBytes,
      },
    };

    const signature = await createSignature(original, signer);
    return toPrintableSignature(signature);
  }
}

export default Sign;
