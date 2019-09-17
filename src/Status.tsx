import { FullSignature, SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { bnsCodec, MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";
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
                <li key={toHex(signature.pubkey.data)}>
                  {this.state.original &&
                    bnsCodec.identityToAddress({
                      chainId: this.state.original.transaction.creator.chainId,
                      pubkey: signature.pubkey,
                    })}
                  :<code>{toPrintableSignature(signature)}</code>
                </li>
              ))}
            </ol>

            <button
              className="btn btn-link"
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
                  console.error(error);
                  const errorMessage = error instanceof Error ? error.message : error.toString();
                  this.setState({ addSignatureError: errorMessage });
                }
              }}
            >
              Add signature
            </button>
            <Alert hidden={!this.state.addSignatureError} variant="danger">
              {this.state.addSignatureError}
            </Alert>

            <h2>Post to blockchain</h2>
            <p>The transaction with all signatures from above will be posted to the IOV blockchain.</p>
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
