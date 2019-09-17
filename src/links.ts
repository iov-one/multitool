import { SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { toPrintableSignedTransaction } from "./signatures";

export function makeStatusLink(transaction: SignedTransaction<SendTransaction & WithCreator>): string {
  const hex = Encoding.toHex(Encoding.toUtf8(toPrintableSignedTransaction(transaction)));
  console.log("Hex representation", hex);

  const prefix = window.location.href.split("#")[0];
  const url = `${prefix}#/status/${hex}`;
  return url;
}

export function makeSigningLink(transaction: SignedTransaction<SendTransaction & WithCreator>): string {
  const hex = Encoding.toHex(Encoding.toUtf8(toPrintableSignedTransaction(transaction)));
  console.log("Hex representation", hex);

  const prefix = window.location.href.split("#")[0];
  const url = `${prefix}#/sign/${hex}`;
  return url;
}
