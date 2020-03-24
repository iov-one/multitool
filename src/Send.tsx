import {
  Address,
  Algorithm,
  Amount,
  ChainId,
  Identity,
  Nonce,
  PubkeyBytes,
  SendTransaction,
  UnsignedTransaction,
} from "@iov/bcp";
import { bnsCodec, multisignatureIdToAddress, MultisignatureTx } from "@iov/bns";
import { Decimal, Encoding, Uint64 } from "@iov/encoding";
import equal from "fast-deep-equal";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Redirect } from "react-router";

import ConditionalError from "./ConditionalError";
import { chains } from "./settings";
import Transaction from "./Transaction";
import { amountToString } from "./util/amounts";
import { getBalance } from "./util/connection";
import { getErrorMessage } from "./util/errors";
import { createWithFirstSignature, getPubkeyFromLedger } from "./util/ledger";
import { makeStatusLink } from "./util/links";

interface SendProps {}

interface SendState {
  readonly creatorHex: string;
  readonly chain: string;
  readonly formMultisigContractId: string;
  readonly formRecipient: string;
  readonly formQuantity: string;
  readonly formMemo: string;
  readonly unsignedTransaction?: UnsignedTransaction & SendTransaction & MultisignatureTx;
  readonly encodingError: string | null;
  readonly getPubkeyError?: string;
  readonly signingError?: string;
  readonly signing: boolean;
  readonly statusUrl?: string;
  readonly lastQueriedMultisigContractId?: string;
  readonly contractInfo?: {
    readonly address: Address;
    readonly balance: readonly Amount[] | undefined;
  };
}

type FormField = "chainId" | "multisigContractId" | "recipient" | "quantity" | "memo";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: SendState = {
  creatorHex: "",
  chain: "iov-mainnet",
  formMultisigContractId: "",
  formRecipient: "",
  formQuantity: "",
  formMemo: "",
  encodingError: null,
  signing: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testingState: SendState = {
  creatorHex: "",
  chain: "iov-exchangenet",
  formMultisigContractId: "21",
  formRecipient: "tiov1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplsnxjl",
  formQuantity: "100.56",
  formMemo: "What a wonderful day",
  encodingError: null,
  signing: false,
};

function expectedPrefixforNetwork(network: "mainnet" | "testnet"): "iov" | "tiov" {
  return network === "mainnet" ? "iov" : "tiov";
}

class Send extends React.Component<SendProps, SendState> {
  public constructor(props: SendProps) {
    super(props);
    this.state = { ...emptyState };
  }

  public componentDidUpdate(): void {
    let encodingError: string | null = null;

    try {
      const chain = chains.get(this.state.chain);
      if (!chain) throw new Error("No configuration for theis chain ID found");

      if (this.state.lastQueriedMultisigContractId !== this.state.formMultisigContractId) {
        this.setState({
          lastQueriedMultisigContractId: this.state.formMultisigContractId,
          contractInfo: undefined,
        });

        getBalance(chain.id, Uint64.fromString(this.state.formMultisigContractId).toNumber())
          .then(({ address, balance }) => {
            this.setState({
              contractInfo: {
                address: address,
                balance: balance,
              },
            });
          })
          .catch(error => console.error(error));
      }

      const multisigId = Uint64.fromString(this.state.formMultisigContractId).toNumber();
      const sender = multisignatureIdToAddress(chain.id as ChainId, multisigId);

      if (!this.state.creatorHex) throw new Error("Transaction creator unset");

      const expectedPrefix = expectedPrefixforNetwork(chain.networkType);
      if (!this.state.formRecipient.startsWith(expectedPrefix)) {
        throw new Error(`Recipient address with prefix '${expectedPrefix}' expected`);
      }

      const tx: SendTransaction & MultisignatureTx = {
        kind: "bcp/send",
        chainId: chain.id as ChainId,
        amount: {
          quantity: Decimal.fromUserInput(this.state.formQuantity, 9).atomics,
          fractionalDigits: 9,
          tokenTicker: chain.tokenTicker,
        },
        sender: sender,
        recipient: this.state.formRecipient as Address,
        memo: this.state.formMemo,
        fee: { tokens: chain.fee },
        multisig: [multisigId],
      };

      // test serialization for input validation
      bnsCodec.bytesToSign(tx, 0 as Nonce);

      if (!equal(this.state.unsignedTransaction, tx)) {
        this.setState({
          unsignedTransaction: tx,
          encodingError: null,
        });
      }
    } catch (error) {
      encodingError = getErrorMessage(error);
    }

    if (this.state.encodingError !== encodingError) {
      this.setState({
        unsignedTransaction: undefined,
        encodingError: encodingError,
      });
    }
  }

  public render(): JSX.Element {
    return (
      <Container>
        {this.state.statusUrl && <Redirect to={this.state.statusUrl} push />}
        <Row>
          <Col className="col-6">
            <h3>Enter transaction</h3>
            <form>
              <div className="form-group">
                <label htmlFor="chainIdInput">Chain ID</label>
                <select
                  className="form-control"
                  id="chainIdInput"
                  value={this.state.chain}
                  onChange={e => this.handleFormChange("chainId", e)}
                >
                  {Array.from(chains.entries()).map(entry => (
                    <option key={entry[0] + entry[1].id}>{entry[0]}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="creatorInput">Transaction creator</label>
                <button
                  className="btn btn-link btn-sm"
                  onClick={event => {
                    event.preventDefault();
                    this.reloadCreatorFromLedger();
                  }}
                >
                  Get from Ledger
                </button>
                <button
                  className="btn btn-link btn-sm"
                  onClick={event => {
                    event.preventDefault();
                    this.clearCreator();
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

              <ConditionalError error={this.state.getPubkeyError} />

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
                <small className="form-text text-muted">Quantity, e.g. 100.56 for 100.56 IOV</small>
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

              <p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={this.state.signing || !this.state.unsignedTransaction}
                  onClick={event => {
                    event.preventDefault();
                    this.signAndContinue();
                  }}
                >
                  Sign and continue
                </button>
              </p>

              <Alert hidden={!this.state.signing} variant="info">
                Please sign transaction using Ledger device now
              </Alert>
              <ConditionalError error={this.state.signingError} />
            </form>
          </Col>
          <Col className="col-6">
            <h3>Multisig contract info</h3>
            {this.state.contractInfo && (
              <p>
                Address: {this.state.contractInfo.address}
                <br />
                Balance:{" "}
                {this.state.contractInfo.balance
                  ? this.state.contractInfo.balance.map(amountToString).join(", ")
                  : "–"}
              </p>
            )}

            <h3>Details</h3>
            {this.state.unsignedTransaction && (
              <div>
                <p>This is a machine processable representation of the transaction.</p>
                <Transaction transaction={this.state.unsignedTransaction} />
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
        this.setState({ chain: newValue });
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

  private clearCreator(): void {
    this.setState({
      creatorHex: "",
      getPubkeyError: undefined,
    });
  }

  private reloadCreatorFromLedger(): void {
    this.clearCreator();

    const chain = chains.get(this.state.chain);
    if (!chain) throw new Error("Chain not found");

    getPubkeyFromLedger(chain.networkType).then(
      response => {
        const pubkeyHex = Encoding.toHex(response.pubkey);
        console.log("Received pubkey from Ledger:", pubkeyHex);
        this.setState({ creatorHex: pubkeyHex });
      },
      error => {
        console.info("Full error message", error);
        this.setState({ getPubkeyError: getErrorMessage(error) });
      },
    );
  }

  private signAndContinue(): void {
    this.setState({
      signingError: undefined,
      signing: true,
    });

    if (!this.state.unsignedTransaction) throw new Error("unsigned transaction not set");

    const chain = chains.get(this.state.chain);
    const firstSigner: Identity = {
      chainId: chain?.id as ChainId,
      pubkey: {
        algo: Algorithm.Ed25519,
        data: Encoding.fromHex(this.state.creatorHex) as PubkeyBytes,
      },
    };
    createWithFirstSignature(this.state.unsignedTransaction, firstSigner).then(
      signed => {
        const statusUrl = makeStatusLink(signed);
        console.log("Navigating to", statusUrl);
        this.setState({
          statusUrl: statusUrl,
          signing: false,
        });
      },
      error => {
        console.info("Full error message", error);
        this.setState({
          signingError: getErrorMessage(error),
          signing: false,
        });
      },
    );
  }
}

export default Send;
