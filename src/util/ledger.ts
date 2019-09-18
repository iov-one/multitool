import {
  ChainId,
  FullSignature,
  Identity,
  isSendTransaction,
  isUnsignedTransaction,
  Nonce,
  PubkeyBytes,
  SendTransaction,
  SignatureBytes,
  SignedTransaction,
  UnsignedTransaction,
  WithCreator,
} from "@iov/bcp";
import { bnsCodec, createBnsConnector, isMultisignatureTx, MultisignatureTx } from "@iov/bns";
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

export async function createSignature(
  transaction: UnsignedTransaction,
  signer: Identity,
): Promise<FullSignature> {
  const nonce = await getNonce(signer);
  const { bytes } = bnsCodec.bytesToSign(transaction, nonce);

  const transport = await TransportWebUSB.create(5000);

  const app = new IovLedgerApp(transport);
  const versionResponse = await app.getVersion();
  if (!isIovLedgerAppVersion(versionResponse)) throw new Error(versionResponse.errorMessage);
  const addressResponse = await app.getAddress(addressIndex);
  if (!isIovLedgerAppAddress(addressResponse)) throw new Error(addressResponse.errorMessage);
  const signatureResponse = await app.sign(addressIndex, bytes);
  if (!isIovLedgerAppSignature(signatureResponse)) throw new Error(signatureResponse.errorMessage);

  await transport.close();

  const signature: FullSignature = {
    pubkey: signer.pubkey,
    nonce: nonce,
    signature: signatureResponse.signature as SignatureBytes,
  };

  return signature;
}

export async function createSigned(
  unsigned: string,
): Promise<SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>> {
  const transaction = TransactionEncoder.fromJson(JSON.parse(unsigned));
  if (
    !isUnsignedTransaction(transaction) ||
    !isSendTransaction(transaction) ||
    !isMultisignatureTx(transaction)
  ) {
    throw new Error("Invalid transaction format in RPC request to Ledger endpoint.");
  }

  const signature = await createSignature(transaction, transaction.creator);

  const signedTransaction: SignedTransaction<SendTransaction & MultisignatureTx & WithCreator> = {
    transaction: transaction,
    primarySignature: signature,
    otherSignatures: [],
  };

  return signedTransaction;
}
