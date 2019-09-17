import {
  FullSignature,
  isPubkeyBundle,
  isSendTransaction,
  isUnsignedTransaction,
  SendTransaction,
  SignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { isMultisignatureTx, MultisignatureTx } from "@iov/bns";
import { isNonNullObject, isUint8Array, TransactionEncoder } from "@iov/encoding";

export function isFullSignature(data: unknown): data is FullSignature {
  if (!isNonNullObject(data)) return false;

  const { nonce, pubkey, signature } = data as FullSignature;
  if (typeof nonce !== "number") return false;
  if (!isPubkeyBundle(pubkey)) return false;
  if (!isUint8Array(signature)) return false;

  return true;
}

export function isSignedMultisignatureSendTransaction(
  data: unknown,
): data is SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> {
  if (!isNonNullObject(data)) return false;

  const { transaction, primarySignature, otherSignatures } = data as SignedTransaction;

  if (!isUnsignedTransaction(transaction)) return false;
  if (!isSendTransaction(transaction)) return false;
  if (!isMultisignatureTx(transaction)) return false;
  if (!isFullSignature(primarySignature)) return false;
  if (!Array.isArray(otherSignatures) || otherSignatures.some(sig => !isFullSignature(sig))) return false;

  return true;
}

export function toPrintableSignature(signature: FullSignature): string {
  return JSON.stringify(TransactionEncoder.toJson(signature));
}

export function fromPrintableSignature(input: string): FullSignature {
  const fullSignature = TransactionEncoder.fromJson(JSON.parse(input));
  if (!isFullSignature(fullSignature)) throw new Error("Invalid signature format");
  return fullSignature;
}

export function toPrintableSignedTransaction(signed: SignedTransaction): string {
  return JSON.stringify(TransactionEncoder.toJson(signed));
}
