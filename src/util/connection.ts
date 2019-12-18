import {
  Address,
  Amount,
  ChainConnector,
  ChainId,
  isBlockInfoFailed,
  isBlockInfoPending,
  Nonce,
  PubkeyBundle,
  SendTransaction,
  SignedTransaction,
  TransactionId,
} from "@iov/bcp";
import { bnsCodec, createBnsConnector, multisignatureIdToAddress, MultisignatureTx } from "@iov/bns";

import { chains } from "../settings";

export async function getConnector(chainId: ChainId): Promise<ChainConnector> {
  const chain = chains.get(chainId);
  if (!chain) throw new Error("Chain not found");

  const bnsConnector = createBnsConnector(chain.nodeUrl, chainId as ChainId);
  return bnsConnector;
}

export async function getNonce(chainId: ChainId, pubkey: PubkeyBundle): Promise<Nonce> {
  const connector = await getConnector(chainId);
  const bnsConnection = await connector.establishConnection();
  const nonce = await bnsConnection.getNonce({ pubkey: pubkey });
  bnsConnection.disconnect();
  return nonce;
}

export async function getBalance(
  chainId: ChainId,
  contractId: number,
): Promise<{ readonly address: Address; readonly balance: readonly Amount[] | undefined }> {
  const address = multisignatureIdToAddress(chainId, contractId);
  const connector = await getConnector(chainId);
  const bnsConnection = await connector.establishConnection();
  const account = await bnsConnection.getAccount({ address: address });
  bnsConnection.disconnect();
  return {
    address: address,
    balance: account ? account.balance : undefined,
  };
}

export async function postSignedTransaction(
  signed: SignedTransaction<SendTransaction & MultisignatureTx>,
): Promise<TransactionId> {
  const connector = await getConnector(signed.transaction.chainId);
  const bnsConnection = await connector.establishConnection();

  const response = await bnsConnection.postTx(bnsCodec.bytesToPost(signed));
  const blockInfo = await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
  if (isBlockInfoPending(blockInfo)) throw new Error("Block info still pending. This is a bug");

  if (isBlockInfoFailed(blockInfo)) {
    throw new Error(`Error posting transaction: ${blockInfo.message}`);
  }

  return response.transactionId;
}
