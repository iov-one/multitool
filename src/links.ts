import { SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { toPrintableSignedTransaction } from "./signatures";

export function makeStatusLink(
  transaction: SignedTransaction<SendTransaction & WithCreator>,
  absolute = false,
): string {
  const hex = Encoding.toHex(Encoding.toUtf8(toPrintableSignedTransaction(transaction)));

  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/status/${hex}`;
  return url;
}

export function makeSigningLink(
  transaction: SignedTransaction<SendTransaction & WithCreator>,
  absolute = false,
): string {
  const hex = Encoding.toHex(Encoding.toUtf8(toPrintableSignedTransaction(transaction)));

  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/sign/${hex}`;
  return url;
}
