import { PubkeyBytes } from "@iov/bcp";
import { IovLedgerApp, isIovLedgerAppAddress, isIovLedgerAppVersion } from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

export interface PubkeyResponse {
  readonly pubkey: PubkeyBytes;
  readonly network: "mainnet" | "testnet";
}

export async function getPubkeyFromLedger(): Promise<PubkeyResponse> {
  const transport = await TransportWebUSB.create(1000);

  const addressIndex = 0;

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
