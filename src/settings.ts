import { Amount, ChainId, TokenTicker } from "@iov/bcp";

export interface ChainInfo {
  readonly id: ChainId;
  readonly tokenTicker: TokenTicker;
  readonly fee: Amount;
  readonly nodeUrl: string;
  readonly networkType: "testnet" | "mainnet";
}

type Chain = [string, ChainInfo];

const devnet: Chain = [
  "local-iov-devnet",
  {
    id: "local-iov-devnet" as ChainId,
    tokenTicker: "CASH" as TokenTicker,
    fee: {
      quantity: "100000000",
      fractionalDigits: 9,
      tokenTicker: "CASH" as TokenTicker,
    },
    nodeUrl: "ws://localhost:23456/",
    networkType: "testnet",
  },
];

const exchangenet: Chain = [
  "iov-exchangenet",
  {
    id: "iov-exchangenet" as ChainId,
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "500000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "wss://rpc-private-a-x-exchangenet.iov.one",
    networkType: "testnet",
  },
];

const mainnet: Chain = [
  "iov-mainnet",
  {
    id: "iov-mainnet" as ChainId,
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "500000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "wss://rpc-private-a-vip-mainnet.iov.one",
    networkType: "mainnet",
  },
];

const devnets: readonly Chain[] = process.env.NODE_ENV === "development" ? [devnet] : [];
const testnets: readonly Chain[] = [exchangenet];

export const chains = new Map<string, ChainInfo>([...devnets, ...testnets, mainnet]);
