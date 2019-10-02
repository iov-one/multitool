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

const babynet: Chain = [
  "iov-babynet",
  {
    id: "iov-babynet" as ChainId,
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "500000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "wss://rpc-private-a-vip-babynet.iov.one",
    networkType: "testnet",
  },
];

const clapnet: Chain = [
  "iov-clapnet",
  {
    id: "iov-clapnet" as ChainId,
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "500000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "wss://rpc-private-a-vip2-clapnet.iov.one",
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
    nodeUrl: "wss://rpc-private-a.iov.one",
    networkType: "mainnet",
  },
];

export const chains = new Map<string, ChainInfo>([devnet, babynet, clapnet, mainnet]);
