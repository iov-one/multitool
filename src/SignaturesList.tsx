import { ChainId, FullSignature } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import React from "react";
import Alert from "react-bootstrap/Alert";

import { getNonce } from "./util/connection";
import { toPrintableSignature } from "./util/signatures";
import { ellideMiddle } from "./util/text";

const { toHex } = Encoding;

interface NonceStatus {
  readonly error?: {
    readonly received: number;
    readonly expected: number;
  };
}

interface SignatureProps {
  readonly index: number;
  readonly chainId: ChainId;
  readonly signature: FullSignature;
  readonly noneStatus?: NonceStatus;
}

const Signature = ({ index, chainId, signature, noneStatus }: SignatureProps): JSX.Element => {
  const address = bnsCodec.identityToAddress({ chainId: chainId, pubkey: signature.pubkey });
  return (
    <li className="list-group-item last-child-no-bottom-margin" key={toHex(signature.pubkey.data)}>
      <h5>
        {`#${index + 1}`} {ellideMiddle(address, 22)}
      </h5>
      <p className="text-muted text-break">{toPrintableSignature(signature)}</p>
      {noneStatus && noneStatus.error && (
        <Alert variant="warning">
          Nonce outdated. In signature: {noneStatus.error.received}; Expected: {noneStatus.error.expected}
        </Alert>
      )}
    </li>
  );
};

interface SignaturesListPros {
  readonly chainId: ChainId;
  readonly signatures: readonly FullSignature[];
}

interface SignaturesListState {
  readonly nonceStatuses: readonly NonceStatus[];
}

class SignaturesList extends React.Component<SignaturesListPros, SignaturesListState> {
  private interval: NodeJS.Timeout | undefined;

  public constructor(props: SignaturesListPros) {
    super(props);
    this.state = {
      nonceStatuses: props.signatures.map((_): NonceStatus => ({})),
    };
  }

  public componentDidMount(): void {
    const runCheck = async (): Promise<void> => {
      try {
        const statuses = await Promise.all(
          this.props.signatures.map(
            async (signature): Promise<NonceStatus> => {
              const latestNonce = await getNonce(this.props.chainId, signature.pubkey);
              if (signature.nonce === latestNonce) {
                return {};
              } else {
                return {
                  error: {
                    expected: latestNonce,
                    received: signature.nonce,
                  },
                };
              }
            },
          ),
        );
        this.setState({ nonceStatuses: statuses });
      } catch (error) {
        console.warn(error);
      }
    };

    setTimeout(runCheck, 300); // initial run
    this.interval = setInterval(runCheck, 7000);
  }

  public componentWillUnmount(): void {
    if (this.interval) clearTimeout(this.interval);
    this.interval = undefined;
  }

  public render(): JSX.Element {
    return (
      <ol className="list-group mb-3">
        {this.props.signatures.map((signature, index) => (
          <Signature
            key={toHex(signature.signature)}
            index={index}
            chainId={this.props.chainId}
            signature={signature}
            noneStatus={this.state.nonceStatuses[index]}
          />
        ))}
      </ol>
    );
  }
}

export default SignaturesList;
