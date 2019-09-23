import { SendTransaction, SignedTransaction, UnsignedTransaction, WithCreator } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";

import { base64urlDecode, base64urlEncode } from "./base64url";
import { decodeChecksummed, encodeChecksummed } from "./checksummed";
import {
  isSignedMultisignatureSendTransaction,
  isUnsignedMultisignatureSendTransaction,
  toPrintableSignedTransaction,
} from "./signatures";

const { fromUtf8, toUtf8 } = Encoding;

function toLinkEncoded(transaction: SignedTransaction | UnsignedTransaction): string {
  const data = toUtf8(toPrintableSignedTransaction(transaction));
  return encodeChecksummed(data, base64urlEncode);
}

export function signedFromLinkEncoded(
  encoded: string,
): SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> {
  const data = decodeChecksummed(encoded, base64urlDecode);
  const signedTransaction = TransactionEncoder.fromJson(JSON.parse(fromUtf8(data)));
  if (!isSignedMultisignatureSendTransaction(signedTransaction)) {
    throw new Error(
      "Transaction data is not an SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>",
    );
  }
  return signedTransaction;
}

export function unsignedFromLinkEncoded(encoded: string): SendTransaction & MultisignatureTx & WithCreator {
  const data = decodeChecksummed(encoded, base64urlDecode);
  const unsignedTransaction = TransactionEncoder.fromJson(JSON.parse(fromUtf8(data)));
  if (!isUnsignedMultisignatureSendTransaction(unsignedTransaction)) {
    throw new Error("Transaction data is not an SendTransaction & MultisignatureTx & WithCreator");
  }
  return unsignedTransaction;
}

export function makeStatusLink(
  signedTransaction: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>,
  absolute = false,
): string {
  const encodedTransaction = toLinkEncoded(signedTransaction);
  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/status/${encodedTransaction}`;
  return url;
}

export function makeSigningLink(
  unsignedTransaction: SendTransaction & MultisignatureTx & WithCreator,
  absolute = false,
): string {
  const encodedTransaction = toLinkEncoded(unsignedTransaction);
  const prefix = absolute ? window.location.href.split("#")[0] + "#" : "";
  const url = `${prefix}/sign/${encodedTransaction}`;
  return url;
}
