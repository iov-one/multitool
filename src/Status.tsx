import {
  Algorithm,
  FullSignature,
  Identity,
  isSendTransaction,
  isUnsignedTransaction,
  PubkeyBytes,
  SendTransaction,
  SignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { isMultisignatureTx, MultisignatureTx } from "@iov/bns";
import { Encoding, isNonNullObject, TransactionEncoder } from "@iov/encoding";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createSignature, getPubkeyFromLedger } from "./ledger";
import { fromPrintableSignature, isFullSignature, toPrintableSignature } from "./signatures";

const { fromHex, toHex } = Encoding;

interface StatusProps {}

interface StatusState {
  readonly transaction: (SendTransaction & MultisignatureTx & WithCreator) | null;
  readonly signatures: readonly FullSignature[];
  readonly localSignature: string;
}

function isSignedSendTransaction(data: unknown): data is SignedTransaction<SendTransaction & WithCreator> {
  if (!isNonNullObject(data)) return false;

  const { transaction, primarySignature, otherSignatures } = data as SignedTransaction;

  if (!isUnsignedTransaction(transaction)) return false;
  if (!isSendTransaction(transaction)) return false;
  if (!isFullSignature(primarySignature)) return false;
  if (!Array.isArray(otherSignatures) || otherSignatures.some(sig => !isFullSignature(sig))) return false;

  return true;
}

class Status extends React.Component<StatusProps, StatusState> {
  public constructor(props: StatusProps) {
    super(props);
    this.state = {
      transaction: null,
      signatures: [],
      localSignature: "",
    };
  }

  public componentDidMount(): void {
    if (!this.state.transaction) {
      const href = window.location.href;
      console.log(href);

      const matches = href.match(/\/status\/([a-f0-9]+)/);
      if (matches && matches.length >= 2) {
        const payload = fromHex(matches[1]);
        console.log(`Got payload of ${payload.length} bytes`);
        const signedTransaction = TransactionEncoder.fromJson(JSON.parse(Encoding.fromUtf8(payload)));
        if (!isSignedSendTransaction(signedTransaction)) {
          throw new Error("Transaction data is not an SignedTransaction<SendTransaction>");
        }

        const { transaction, primarySignature, otherSignatures } = signedTransaction;

        if (!isMultisignatureTx(transaction)) throw new Error("Transaction data is not a MultisignatureTx");

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
            <pre>{JSON.stringify(TransactionEncoder.toJson(this.state.transaction), null, 2)}</pre>

            <h2>Create Signature</h2>

            <div className="form-group">
              <label htmlFor="yourSignature">Your signature</label>
              <textarea
                className="form-control"
                id="yourSignature"
                rows={5}
                value={this.state.localSignature}
                readOnly={true}
              ></textarea>
            </div>

            <button
              className="btn btn-primary"
              onClick={async event => {
                event.preventDefault();
                const signature = await this.createSignature();
                this.setState({
                  localSignature: signature,
                });
              }}
            >
              Sign transaction now
            </button>
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
    return JSON.stringify(TransactionEncoder.toJson(signature));
  }
}

export default Status;
