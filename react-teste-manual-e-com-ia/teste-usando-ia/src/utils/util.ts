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
  console.log(digits);
  const groups = digits.match(/\d{1,2}/g);

  return groups ? groups.join(":") : "";
}
