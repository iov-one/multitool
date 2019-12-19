import {
  FullSignature,
  Identity,
  PubkeyBytes,
  SendTransaction,
  SignatureBytes,
  SignedTransaction,
  UnsignedTransaction,
} from "@iov/bcp";
import { bnsCodec, MultisignatureTx } from "@iov/bns";
import {
  IovLedgerApp,
  isIovLedgerAppAddress,
  isIovLedgerAppSignature,
  isIovLedgerAppVersion,
} from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { getNonce } from "./connection";

const addressIndex = 0;

export interface PubkeyResponse {
  readonly pubkey: PubkeyBytes;
}

export async function getPubkeyFromLedger(
  requiredNetworkType: "testnet" | "mainnet",
): Promise<PubkeyResponse> {
  const transport = await TransportWebUSB.create(1000);

  try {
    const app = new IovLedgerApp(transport);
    const versionResponse = await app.getVersion();
    if (!isIovLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
    const responseNetwork = versionResponse.testMode ? "testnet" : "mainnet";
    if (requiredNetworkType !== responseNetwork) {
      throw new Error(
        `Pubkey for ${requiredNetworkType} required but got response from the ${responseNetwork} app`,
      );
    }

    const response = await app.getAddress(addressIndex);
    if (!isIovLedgerAppAddress(response)) throw new Error(response.errorMessage);

    return {
      pubkey: response.pubkey as PubkeyBytes,
    };
  } finally {
    await transport.close();
  }
}

export async function createSignature(
  transaction: UnsignedTransaction,
  signer: Identity,
): Promise<FullSignature> {
  const nonce = await getNonce(signer.chainId, signer.pubkey);
  const { bytes } = bnsCodec.bytesToSign(transaction, nonce);
  const requiredNetworkType = signer.chainId === "iov-mainnet" ? "mainnet" : "testnet";

  const transport = await TransportWebUSB.create(5000);

  try {
    const app = new IovLedgerApp(transport);
    const versionResponse = await app.getVersion();
    if (!isIovLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
    const responseNetwork = versionResponse.testMode ? "testnet" : "mainnet";
    if (requiredNetworkType !== responseNetwork) {
      throw new Error(
        `Pubkey for ${requiredNetworkType} required but got response from the ${responseNetwork} app`,
      );
    }

    const signatureResponse = await app.sign(addressIndex, bytes);
    if (!isIovLedgerAppSignature(signatureResponse)) throw new Error(signatureResponse.errorMessage);

    return {
      pubkey: signer.pubkey,
      nonce: nonce,
      signature: signatureResponse.signature as SignatureBytes,
    };
  } finally {
    await transport.close();
  }
}

export async function createWithFirstSignature(
  unsigned: UnsignedTransaction & SendTransaction & MultisignatureTx,
  signer: Identity,
): Promise<SignedTransaction<SendTransaction & MultisignatureTx>> {
  const signature = await createSignature(unsigned, signer);
  return {
    transaction: unsigned,
    signatures: [signature],
  };
}
