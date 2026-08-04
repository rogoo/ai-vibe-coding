/** A string that may not have been filled in yet. */
export type MaybeString = string | null | undefined;

/**
 * Checks whether the string is made up of digits only.
 * null, undefined and an empty string return false, since they have no digits.
 */
export function isOnlyNumbers(value: MaybeString): boolean {
  return /^\d+$/.test(value ?? "");
}

/**
 * Returns only the digits of the string, dropping every other character.
 * "(11) 98765-4321" -> "11987654321", null/undefined -> ""
 */
export function getOnlyNumbers(value: MaybeString): string {
  return (value ?? "").replace(/\D/g, "");
}

/**
 * Formats the digits of the string as a time mask, "hh:mm:ss".
 * Non-digits are ignored and anything past the sixth digit is dropped, so the
 * result grows as the user types: "1" -> "1", "123" -> "12:3",
 * "123045" -> "12:30:45", "12:30:45" -> "12:30:45".
 * null and undefined return "".
 */
export function formatTime(value: MaybeString): string {
  const digits = getOnlyNumbers(value).slice(0, 6).padEnd(6, "0");
  const groups = digits.match(/\d{1,2}/g);

  return groups ? groups.join(":") : "";
}

/**
 * Formats the digits of the string as a phone mask, "(XX) XXXXX-XXXX" when
 * there are 11 digits and "(XX) XXXX-XXXX" otherwise.
 * Non-digits are ignored and anything past the eleventh digit is dropped, so
 * the result grows as the user types: "1" -> "(1", "1198" -> "(11) 98",
 * "1187654321" -> "(11) 8765-4321", "11987654321" -> "(11) 98765-4321".
 * null, undefined and an empty string return "".
 */
export function convertToPhoneNumber(value: MaybeString): string {
  const digits = getOnlyNumbers(value).slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  const areaCode = digits.slice(0, 2);

  if (digits.length <= 2) {
    return `(${areaCode}`;
  }

  const prefixLength = digits.length === 11 ? 5 : 4;
  const prefix = digits.slice(2, 2 + prefixLength);
  const suffix = digits.slice(2 + prefixLength);

  if (suffix.length === 0) {
    return `(${areaCode}) ${prefix}`;
  }

  return `(${areaCode}) ${prefix}-${suffix}`;
}
