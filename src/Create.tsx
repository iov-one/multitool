import {
  Address,
  Algorithm,
  ChainId,
  Nonce,
  PubkeyBytes,
  SendTransaction,
  TokenTicker,
  WithCreator,
} from "@iov/bcp";
import { bnsCodec, multisignatureIdToAddress, MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder, Uint64 } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createSigned, getPubkeyFromLedger } from "./ledger";
import { makeSigningLink, makeStatusLink } from "./links";
import { Decimal } from "./util/decimal";
import { prettyPrintJson } from "./util/json";

interface CreateProps {}

interface CreateState {
  readonly creatorHex: string;
  readonly chainId: string;
  readonly formMultisigContractId: string;
  readonly formRecipient: string;
  readonly formQuantity: string;
  readonly formMemo: string;
  readonly unsignedTransactionJson: string | null;
  readonly encodingError: string | null;
}

type FormField = "chainId" | "multisigContractId" | "recipient" | "quantity" | "memo";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: CreateState = {
  creatorHex: "",
  chainId: "iov-mainnet",
  formMultisigContractId: "",
  formRecipient: "",
  formQuantity: "",
  formMemo: "",
  unsignedTransactionJson: null,
  encodingError: null,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testingState: CreateState = {
  creatorHex: "",
  chainId: "iov-boarnet",
  formMultisigContractId: "21",
  formRecipient: "iov1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp396zjw",
  formQuantity: "100.56",
  formMemo: "What a wonderful day",
  unsignedTransactionJson: null,
  encodingError: null,
};

class Create extends React.Component<CreateProps, CreateState> {
  public constructor(props: CreateProps) {
    super(props);
    this.state = { ...testingState };
  }

  public componentDidUpdate(): void {
    let encodingError: string | null = null;

    try {
      const multisigId = Uint64.fromString(this.state.formMultisigContractId);

      const sender = multisignatureIdToAddress(
        this.state.chainId as ChainId,
        Uint8Array.from(multisigId.toBytesBigEndian()),
      );

      if (!this.state.creatorHex) throw new Error("Transaction creator unset");

      const tx: SendTransaction & MultisignatureTx & WithCreator = {
        kind: "bcp/send",
        creator: {
          chainId: this.state.chainId as ChainId,
          pubkey: {
            algo: Algorithm.Ed25519,
            data: Encoding.fromHex(this.state.creatorHex) as PubkeyBytes,
          },
        },
        amount: {
          quantity: Decimal.fromUserInput(this.state.formQuantity, 9).atomics,
          fractionalDigits: 9,
          tokenTicker: "IOV" as TokenTicker,
        },
        sender: sender,
        recipient: this.state.formRecipient as Address,
        memo: this.state.formMemo,
        fee: {
          tokens: {
            quantity: "100000000",
            fractionalDigits: 9,
            tokenTicker: "IOV" as TokenTicker,
          },
        },
        multisig: [multisigId.toNumber()],
      };

      // test serialization for input validation
      bnsCodec.bytesToSign(tx, 0 as Nonce);

      const unsignedTransactionJson = JSON.stringify(TransactionEncoder.toJson(tx));
      if (this.state.unsignedTransactionJson !== unsignedTransactionJson) {
        this.setState({
          unsignedTransactionJson: unsignedTransactionJson,
          encodingError: null,
        });
      }
    } catch (error) {
      encodingError = error instanceof Error ? error.message : error.toString();
    }

    if (this.state.encodingError !== encodingError) {
      this.setState({
        unsignedTransactionJson: null,
        encodingError: encodingError,
      });
    }
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col className="col-6">
            <h3>Enter transaction</h3>
            <form>
              <div className="form-group">
                <label htmlFor="creatorInput">Transaction creator</label>
                <button
                  className="btn btn-link btn-sm"
                  onClick={event => {
                    event.preventDefault();
                    this.loadCreatorFromLedger();
                  }}
                >
                  Get from Ledger
                </button>
                <button
                  className="btn btn-link btn-sm"
                  onClick={event => {
                    event.preventDefault();
                    this.setState({ creatorHex: "" });
                  }}
                >
                  Clear
                </button>
                <input
                  id="creatorInput"
                  className="form-control"
                  type="text"
                  placeholder="Creator pubkey "
                  value={this.state.creatorHex}
                  disabled
                />
                <small className="form-text text-muted">
                  Pubkey of the person who creates this transaction
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="chainIdInput">Chain ID</label>
                <select
                  className="form-control"
                  id="chainIdInput"
                  value={this.state.chainId}
                  onChange={e => this.handleFormChange("chainId", e)}
                >
                  <option>iov-mainnet</option>
                  <option>iov-boarnet</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="senderInput">Multisig contract ID</label>
                <input
                  id="senderInput"
                  className="form-control"
                  type="text"
                  placeholder="Sender"
                  value={this.state.formMultisigContractId}
                  onChange={e => this.handleFormChange("multisigContractId", e)}
                />
                <small className="form-text text-muted">Use integer format, e.g. 42</small>
                <div className="invalid-feedback">Please choose a username.</div>
              </div>

              <div className="form-group">
                <label htmlFor="recipientInput">Recipient address</label>
                <input
                  id="recipientInput"
                  className="form-control"
                  type="text"
                  placeholder="Recipient"
                  value={this.state.formRecipient}
                  onChange={e => this.handleFormChange("recipient", e)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  IOV address, e.g. iov1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp396zjw
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="quantityInput">Quantity</label>
                <input
                  id="quantityInput"
                  className="form-control"
                  type="text"
                  placeholder="100.56"
                  value={this.state.formQuantity}
                  onChange={e => this.handleFormChange("quantity", e)}
                />
                <small className="form-text text-muted">
                  Quantity in atomics, e.g. 100.56 for 100.56 IOV
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="memoInput">Memo</label>
                <input
                  id="memoInput"
                  className="form-control"
                  type="text"
                  placeholder="Memo"
                  value={this.state.formMemo}
                  onChange={e => this.handleFormChange("memo", e)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  Arbitrary text attached to the transaction
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!this.state.unsignedTransactionJson}
                onClick={event => {
                  event.preventDefault();
                  this.signAndContinue();
                }}
              >
                Sign and continue
              </button>
            </form>
          </Col>
          <Col className="col-6">
            <h3>Details</h3>
            {this.state.unsignedTransactionJson && (
              <div>
                <p>This is a machine processable representation of the transaction.</p>
                <pre>{prettyPrintJson(this.state.unsignedTransactionJson)}</pre>
              </div>
            )}
            <Alert variant="danger" hidden={!this.state.encodingError}>
              <p className="mb-0">
                <strong>Transaction encoding error:</strong>
                <br />
                {this.state.encodingError}
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  private handleFormChange(
    field: FormField,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void {
    const newValue = event.target.value;

    switch (field) {
      case "chainId":
        this.setState({ chainId: newValue });
        break;
      case "multisigContractId":
        this.setState({ formMultisigContractId: newValue });
        break;
      case "recipient":
        this.setState({ formRecipient: newValue });
        break;
      case "quantity":
        this.setState({ formQuantity: newValue });
        break;
      case "memo":
        this.setState({ formMemo: newValue });
        break;
      default:
        throw new Error(`Unsupported form field '${field}'`);
    }
  }

  private loadCreatorFromLedger(): void {
    getPubkeyFromLedger().then(
      response => {
        const pubkeyHex = Encoding.toHex(response.pubkey);
        console.log("Received pubkey from Ledger:", pubkeyHex);
        this.setState({ creatorHex: pubkeyHex });
      },
      error => console.warn(error),
    );
  }

  private signAndContinue(): void {
    if (!this.state.unsignedTransactionJson) throw new Error("unsigned transaction not set");
    createSigned(this.state.unsignedTransactionJson).then(
      signed => {
        const signingUrl = makeSigningLink(signed);
        const statusUrl = makeStatusLink(signed);
        console.log("Navigate to", signingUrl, statusUrl);
      },
      error => console.error(error),
    );
  }
}

export default Create;
