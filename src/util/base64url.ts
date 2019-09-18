import { Encoding } from "@iov/encoding";

export function base64urlEncode(data: Uint8Array): string {
  return Encoding.toBase64(data)
    .replace("+", "-")
    .replace("/", "_");
}

export function base64urlDecode(encoded: string): Uint8Array {
  return Encoding.fromBase64(encoded.replace("-", "+").replace("_", "/"));
}
