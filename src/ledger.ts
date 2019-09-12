import {
  ChainId,
  FullSignature,
  Identity,
  isUnsignedTransaction,
  Nonce,
  PubkeyBytes,
  SignatureBytes,
  SignedTransaction,
} from "@iov/bcp";
import { bnsCodec, createBnsConnector } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import {
  IovLedgerApp,
  isIovLedgerAppAddress,
  isIovLedgerAppSignature,
  isIovLedgerAppVersion,
} from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

const addressIndex = 0;
const bnsConnector = createBnsConnector("https://rpc.boarnet.iov.one/", "iov-boarnet" as ChainId);

export interface PubkeyResponse {
  readonly pubkey: PubkeyBytes;
  readonly network: "mainnet" | "testnet";
}

export async function getPubkeyFromLedger(): Promise<PubkeyResponse> {
  const transport = await TransportWebUSB.create(1000);

  const app = new IovLedgerApp(transport);
  const version = await app.getVersion();
  if (!isIovLedgerAppVersion(version)) {
    await transport.close();
    throw new Error(version.errorMessage);
  }
  const response = await app.getAddress(addressIndex);
  if (!isIovLedgerAppAddress(response)) {
    await transport.close();
    throw new Error(response.errorMessage);
  }

  await transport.close();

  return {
    pubkey: response.pubkey as PubkeyBytes,
    network: version.testMode ? "testnet" : "mainnet",
  };
}

async function getNonce(identity: Identity): Promise<Nonce> {
  const bnsConnection = await bnsConnector.establishConnection();
  const nonce = await bnsConnection.getNonce({ pubkey: identity.pubkey });
  bnsConnection.disconnect();
  return nonce;
}

export async function createAndSign(unsigned: string): Promise<string> {
  const transaction = TransactionEncoder.fromJson(JSON.parse(unsigned));
  if (!isUnsignedTransaction(transaction)) {
    throw new Error("Invalid transaction format in RPC request to Ledger endpoint.");
  }

  const nonce = await getNonce(transaction.creator);
  const { bytes } = bnsCodec.bytesToSign(transaction, nonce);

  const transport = await TransportWebUSB.create(5000);

  const app = new IovLedgerApp(transport);
  const versionResponse = await app.getVersion();
  if (!isIovLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
  const addressResponse = await app.getAddress(addressIndex);
  if (!isIovLedgerAppAddress(addressResponse)) throw new Error(addressResponse.errorMessage);
  const signatureResponse = await app.sign(addressIndex, bytes);
  if (!isIovLedgerAppSignature(signatureResponse)) throw new Error(signatureResponse.errorMessage);
  console.log("isBuffer?", Buffer.isBuffer(signatureResponse.signature));

  await transport.close();

  const signature: FullSignature = {
    pubkey: transaction.creator.pubkey,
    nonce: nonce,
    signature: signatureResponse.signature as SignatureBytes,
  };

  const signedTransaction: SignedTransaction = {
    transaction: transaction,
    primarySignature: signature,
    otherSignatures: [],
  };

  const signedTransactionString = JSON.stringify(TransactionEncoder.toJson(signedTransaction));

  return signedTransactionString;
}
