import {
  FullSignature,
  isFullSignature,
  isSendTransaction,
  isUnsignedTransaction,
  SendTransaction,
  SignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { isMultisignatureTx, MultisignatureTx } from "@iov/bns";
import { isNonNullObject, TransactionEncoder } from "@iov/encoding";

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

export function makeSignedTransaction(
  transaction: SendTransaction & MultisignatureTx & WithCreator,
  signatures: readonly FullSignature[],
): SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> {
  const firstSignature = signatures.find(() => true);
  if (!firstSignature) throw new Error("First signature missing");
  return {
    transaction: transaction,
    primarySignature: firstSignature,
    otherSignatures: signatures.slice(1),
  };
}