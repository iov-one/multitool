import { Amount, TokenTicker } from "@iov/bcp";

export interface ChainInfo {
  readonly tokenTicker: TokenTicker;
  readonly fee: Amount;
  readonly nodeUrl: string;
  readonly networkType: "testnet" | "mainnet";
  readonly recipientPrefix: "tiov" | "iov";
}

type Chain = [string, ChainInfo];

const boarnet: Chain = [
  "iov-boarnet",
  {
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "100000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "https://rpc.boarnet.iov.one",
    networkType: "testnet",
    recipientPrefix: "tiov",
  },
];

const mainnet: Chain = [
  "iov-mainnet",
  {
    tokenTicker: "IOV" as TokenTicker,
    fee: {
      quantity: "100000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    nodeUrl: "https://rpc.mainnet.iov.one",
    networkType: "mainnet",
    recipientPrefix: "iov",
  },
];

export const chains = new Map<string, ChainInfo>([boarnet, mainnet]);
