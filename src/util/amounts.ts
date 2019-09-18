import { Amount } from "@iov/bcp";

import { Decimal } from "./decimal";

// This produces a human readable format of the amount, value and token ticker
export function amountToString(amount: Amount): string {
  const { quantity, fractionalDigits, tokenTicker } = amount;
  return `${Decimal.fromAtomics(quantity, fractionalDigits).toString()} ${tokenTicker}`;
}
