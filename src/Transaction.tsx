import { SendTransaction, UnsignedTransaction } from "@iov/bcp";
import { MultisignatureTx } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import React from "react";

import { prettyPrintJson } from "./util/json";

interface TransactionProps {
  readonly transaction: UnsignedTransaction & SendTransaction & MultisignatureTx;
}

const Transaction = ({ transaction }: TransactionProps): JSX.Element => {
  return <pre>{prettyPrintJson(TransactionEncoder.toJson(transaction))}</pre>;
};

export default Transaction;
