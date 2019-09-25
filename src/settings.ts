import { Amount, ChainId, TokenTicker } from "@iov/bcp";

export interface ChainInfo {
  readonly id: ChainId;
  readonly tokenTicker: TokenTicker;
  readonly fee: Amount;
  readonly nodeUrl: string;
  readonly networkType: "testnet" | "mainnet";
  readonly recipientPrefix: "tiov" | "iov";
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
    recipientPrefix: "tiov",
  },
];

const boarnet: Chain = [
  "iov-boarnet",
  {
    id: "iov-boarnet" as ChainId,
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "100000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "wss://rpc.boarnet.iov.one",
    networkType: "testnet",
    recipientPrefix: "tiov",
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
    recipientPrefix: "iov",
  },
];

export const chains = new Map<string, ChainInfo>([devnet, boarnet, mainnet]);
