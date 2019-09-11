import BN from "bn.js";

export class Decimal {
  public static fromUserInput(input: string, fractionalDigits: number): Decimal {
    for (let index = 0; index < input.length; index++) {
      if (!input[index].match(/^[0-9.]$/)) {
        throw new Error(`Invalid character at position ${index + 1}`);
      }
    }

    const parts = input.split(".");
    if (parts.length > 2) throw new Error("More than one separator found");

    const whole = parts[0] || "";
    const fractional = (parts[1] || "").replace(/0+$/, "");

    if (fractional.length > fractionalDigits) {
      throw new Error("Got more fractional digits than supported");
    }

    const quantity = `${whole}${fractional.padEnd(fractionalDigits, "0")}`;

    return new Decimal(quantity, fractionalDigits);
  }

  private readonly quantity: BN;
  private readonly fractionalDigits: number;

  public constructor(quantity: string, fractionalDigits: number) {
    this.quantity = new BN(quantity);
    this.fractionalDigits = fractionalDigits;
  }

  public getQuantity(): string {
    return this.quantity.toString();
  }
}
