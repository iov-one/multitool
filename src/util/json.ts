import { JsonCompatibleValue } from "@iov/encoding";

export function prettyPrintJson(json: string | JsonCompatibleValue): string {
  const document = typeof json === "string" ? JSON.parse(json) : json;
  return JSON.stringify(document, null, 2);
}
