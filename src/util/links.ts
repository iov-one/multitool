import { SendTransaction, SignedTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";

import { isSignedMultisignatureSendTransaction, toPrintableSignedTransaction } from "./signatures";

const { fromHex, fromUtf8, toHex, toUtf8 } = Encoding;

function toLinkEncoded(
  transaction: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>,
): string {
  return toHex(toUtf8(toPrintableSignedTransaction(transaction)));
}

export function fromLinkEncoded(
  encoded: string,
): SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> {
  const signedTransaction = TransactionEncoder.fromJson(JSON.parse(fromUtf8(fromHex(encoded))));
  if (!isSignedMultisignatureSendTransaction(signedTransaction)) {
    throw new Error(
      "Transaction data is not an SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>",
    );
  }
  return signedTransaction;
}

export function makeStatusLink(
  transaction: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>,
  absolute = false,
): string {
  const encodedTransaction = toLinkEncoded(transaction);
  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/status/${encodedTransaction}`;
  return url;
}

export function makeSigningLink(
  transaction: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>,
  absolute = false,
): string {
  const encodedTransaction = toLinkEncoded(transaction);
  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/sign/${encodedTransaction}`;
  return url;
}
