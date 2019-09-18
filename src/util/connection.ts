import { Address, Amount, ChainConnector, ChainId, Identity, Nonce } from "@iov/bcp";
import { createBnsConnector, multisignatureIdToAddress } from "@iov/bns";
import { Uint64 } from "@iov/encoding";

import { chains } from "../settings";

export async function getConnector(chainId: ChainId): Promise<ChainConnector> {
  const chain = chains.get(chainId);
  if (!chain) throw new Error("Chain not found");

  const bnsConnector = createBnsConnector(chain.nodeUrl, chainId as ChainId);
  return bnsConnector;
}

export async function getNonce(identity: Identity): Promise<Nonce> {
  const connector = await getConnector(identity.chainId);
  const bnsConnection = await connector.establishConnection();
  const nonce = await bnsConnection.getNonce({ pubkey: identity.pubkey });
  bnsConnection.disconnect();
  return nonce;
}

export async function getBalance(
  chainId: ChainId,
  contractId: number,
): Promise<{ readonly address: Address; readonly balance: readonly Amount[] | undefined }> {
  const address = multisignatureIdToAddress(
    chainId,
    Uint8Array.from(Uint64.fromNumber(contractId).toBytesBigEndian()),
  );
  const connector = await getConnector(chainId);
  const bnsConnection = await connector.establishConnection();
  const account = await bnsConnection.getAccount({ address: address });
  bnsConnection.disconnect();
  return {
    address: address,
    balance: account ? account.balance : undefined,
  };
}
