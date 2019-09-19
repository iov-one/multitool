import { ChainId, FullSignature } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";

import { getNonce } from "./util/connection";
import { toPrintableSignature } from "./util/signatures";

const { toHex } = Encoding;

interface SignaturesListPros {
  readonly chainId: ChainId;
  readonly signatures: readonly FullSignature[];
}

interface SignaturesListState {
  readonly nonceStatuses: readonly boolean[];
}

class SignaturesList extends React.Component<SignaturesListPros, SignaturesListState> {
  private interval: NodeJS.Timeout | undefined;

  public constructor(props: SignaturesListPros) {
    super(props);
    this.state = {
      nonceStatuses: [],
    };
  }

  public componentDidMount(): void {
    this.interval = setInterval(async () => {
      const statuses = await Promise.all(
        this.props.signatures.map(async signature => {
          const latestNonce = await getNonce(this.props.chainId, signature.pubkey);
          const outdated = signature.nonce !== latestNonce;
          return outdated;
        }),
      );
      this.setState({ nonceStatuses: statuses });
    }, 5000);
  }

  public componentWillUnmount(): void {
    if (this.interval) clearTimeout(this.interval);
    this.interval = undefined;
  }

  public render(): JSX.Element {
    return (
      <ol className="list-group mb-3">
        {this.props.signatures.map((signature, index) => (
          <li className="list-group-item" key={toHex(signature.pubkey.data)}>
            {bnsCodec.identityToAddress({
              chainId: this.props.chainId,
              pubkey: signature.pubkey,
            })}
            : <code>{toPrintableSignature(signature)}</code>
            {this.state.nonceStatuses[index] && <Alert variant="danger">Nonce is outdated</Alert>}
          </li>
        ))}
      </ol>
    );
  }
}

export default SignaturesList;
