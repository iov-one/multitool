import {
  FullSignature,
  isFullSignature,
  isSendTransaction,
  isUnsignedTransaction,
  PrehashType,
  SendTransaction,
  SignedTransaction,
  UnsignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { bnsCodec, isMultisignatureTx, MultisignatureTx } from "@iov/bns";
import { Ed25519, Sha512 } from "@iov/crypto";
import { isNonNullObject, TransactionEncoder } from "@iov/encoding";

export function isUnsignedMultisignatureSendTransaction(
  data: unknown,
): data is SendTransaction & MultisignatureTx & WithCreator {
  if (!isNonNullObject(data)) return false;

  const transaction = data as SignedTransaction;
  if (!isUnsignedTransaction(transaction)) return false;
  if (!isSendTransaction(transaction)) return false;
  if (!isMultisignatureTx(transaction)) return false;

  return true;
}

export function isSignedMultisignatureSendTransaction(
  data: unknown,
): data is SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> {
  if (!isNonNullObject(data)) return false;

  const { transaction, primarySignature, otherSignatures } = data as SignedTransaction;

  if (!isUnsignedMultisignatureSendTransaction(transaction)) return false;
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

export function toPrintableSignedTransaction(transaction: SignedTransaction | UnsignedTransaction): string {
  return JSON.stringify(TransactionEncoder.toJson(transaction));
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

export async function verifySignature(
  transaction: SendTransaction & MultisignatureTx & WithCreator,
  signature: FullSignature,
): Promise<boolean> {
  const { bytes, prehashType } = bnsCodec.bytesToSign(transaction, signature.nonce);

  switch (prehashType) {
    case PrehashType.Sha512: {
      const prehash = new Sha512(bytes).digest();
      const valid = await Ed25519.verifySignature(signature.signature, prehash, signature.pubkey.data);
      return valid;
    }
    default:
      throw new Error("Unexpected prehash type");
  }
}
