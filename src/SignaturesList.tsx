import { ChainId, FullSignature } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import React from "react";

import { toPrintableSignature } from "./util/signatures";

const { toHex } = Encoding;

interface SignaturesListPros {
  readonly chainId: ChainId;
  readonly signatures: readonly FullSignature[];
}

class SignaturesList extends React.Component<SignaturesListPros, {}> {
  public render(): JSX.Element {
    return (
      <ol className="list-group mb-3">
        {this.props.signatures.map(signature => (
          <li className="list-group-item" key={toHex(signature.pubkey.data)}>
            {bnsCodec.identityToAddress({
              chainId: this.props.chainId,
              pubkey: signature.pubkey,
            })}
            : <code>{toPrintableSignature(signature)}</code>
          </li>
        ))}
      </ol>
    );
  }
}

export default SignaturesList;
