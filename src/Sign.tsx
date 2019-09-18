import { Algorithm, FullSignature, Identity, PubkeyBytes, SendTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createSignature, getPubkeyFromLedger } from "./ledger";
import { isSignedMultisignatureSendTransaction, toPrintableSignature } from "./signatures";
import { prettyPrintJson } from "./util/json";

const { fromHex } = Encoding;

interface SignProps {}

interface SignState {
  readonly transaction: (SendTransaction & MultisignatureTx & WithCreator) | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
  readonly signingError?: string;
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
      const matches = window.location.href.match(/\/sign\/([a-f0-9]+)/);
      if (matches && matches.length >= 2) {
        const payload = fromHex(matches[1]);
        console.log(`Got payload of ${payload.length} bytes`);
        const signedTransaction = TransactionEncoder.fromJson(JSON.parse(Encoding.fromUtf8(payload)));
        if (!isSignedMultisignatureSendTransaction(signedTransaction)) {
          throw new Error("Transaction data is not an SignedTransaction<SendTransaction>");
        }

        const { transaction, primarySignature, otherSignatures } = signedTransaction;
        this.setState({
          transaction: transaction,
          signatures: [primarySignature, ...otherSignatures],
        });
      }
    }
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col className="col-6">
            <h2>Review transaction</h2>
            <pre>{prettyPrintJson(TransactionEncoder.toJson(this.state.transaction))}</pre>
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
                    const errorMessage = error instanceof Error ? error.message : error.toString();
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

            <Alert hidden={!this.state.signingError} variant="danger">
              {this.state.signingError}
            </Alert>
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

    const pubkeyResponse = await getPubkeyFromLedger();

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
