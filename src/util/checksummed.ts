import { Sha256 } from "@iov/crypto";

import { arrayEquals } from "./arrays";

export type Encoder = (data: Uint8Array) => string;
export type Decoder = (encoded: string) => Uint8Array;

const checksumLength = 4; // bytes

function makeChecksum(data: Uint8Array): Uint8Array {
  return new Sha256(data).digest().slice(0, checksumLength);
}

export function encodeChecksummed(data: Uint8Array, encoder: Encoder): string {
  const checksum = makeChecksum(data);
  return encoder(new Uint8Array([...checksum, ...data]));
}

export function decodeChecksummed(encoded: string, decoder: Decoder): Uint8Array {
  const decoded = decoder(encoded);
  const expectedChecksum = decoded.slice(0, checksumLength);
  const raw = decoded.slice(checksumLength);

  if (!arrayEquals(expectedChecksum, makeChecksum(raw))) throw new Error("Checksum mismatch");

  return raw;
}
