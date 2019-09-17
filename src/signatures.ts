import { FullSignature, isPubkeyBundle } from "@iov/bcp";
import { isNonNullObject, isUint8Array, TransactionEncoder } from "@iov/encoding";

export function isFullSignature(data: unknown): data is FullSignature {
  if (!isNonNullObject(data)) return false;

  const { nonce, pubkey, signature } = data as FullSignature;
  if (typeof nonce !== "number") return false;
  if (!isPubkeyBundle(pubkey)) return false;
  if (!isUint8Array(signature)) return false;

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
