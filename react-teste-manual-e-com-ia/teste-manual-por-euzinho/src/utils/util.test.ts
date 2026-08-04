import {
  convertToPhoneNumber,
  formatTime,
  getOnlyNumbers,
  isOnlyNumbers,
} from "./util";

describe("convertToPhoneNumber", () => {
  it('null to ""', () => {
    expect(convertToPhoneNumber(null)).toBe("");
  });

  it('undefined to ""', () => {
    expect(convertToPhoneNumber(undefined)).toBe("");
  });

  it('empty string to ""', () => {
    expect(convertToPhoneNumber("")).toBe("");
  });

  it('"asdf4asdf." to "(4"', () => {
    expect(convertToPhoneNumber("asdf4asdf.")).toBe("(4");
  });

  it('"11" to "(11"', () => {
    expect(convertToPhoneNumber("11")).toBe("(11");
  });

  it('"119" to "(11) 9"', () => {
    expect(convertToPhoneNumber("119")).toBe("(11) 9");
  });

  it('"1198" to "(11) 98"', () => {
    expect(convertToPhoneNumber("1198")).toBe("(11) 98");
  });

  it('"11987" to "(11) 987"', () => {
    expect(convertToPhoneNumber("11987")).toBe("(11) 987");
  });

  it('"119876" to "(11) 9876"', () => {
    expect(convertToPhoneNumber("119876")).toBe("(11) 9876");
  });

  it('"1198765" to "(11) 9876-5"', () => {
    expect(convertToPhoneNumber("1198765")).toBe("(11) 9876-5");
  });

  it('"11987654" to "(11) 9876-54"', () => {
    expect(convertToPhoneNumber("11987654")).toBe("(11) 9876-54");
  });

  it('"119876543" to "(11) 9876-543"', () => {
    expect(convertToPhoneNumber("119876543")).toBe("(11) 9876-543");
  });

  it('"1198765432" to "(11) 9876-5432"', () => {
    expect(convertToPhoneNumber("1198765432")).toBe("(11) 9876-5432");
  });

  it('"11987654321" to "(11) 9876-4321"', () => {
    expect(convertToPhoneNumber("11987654321")).toBe("(11) 98765-4321");
  });

  it('"119876543219" to "(11) 9876-4321"', () => {
    expect(convertToPhoneNumber("119876543219")).toBe("(11) 98765-4321");
  });
});

describe("getOnlyNumbers", () => {
  it('null to ""', () => {
    expect(getOnlyNumbers(null)).toBe("");
  });

  it('undefined to ""', () => {
    expect(getOnlyNumbers(undefined)).toBe("");
  });

  it('" .56-=" to ""', () => {
    expect(getOnlyNumbers(" .56-=")).toBe("56");
  });

  it('"asdf4asdf." to ""', () => {
    expect(getOnlyNumbers("asdf4asdf.")).toBe("4");
  });
});

describe("isOnlyNumbers", () => {
  it("null to false", () => {
    expect(isOnlyNumbers(null)).toBe(false);
  });

  it("undefined to false", () => {
    expect(isOnlyNumbers(undefined)).toBe(false);
  });

  it("0.0 to false", () => {
    expect(isOnlyNumbers("0.0")).toBe(false);
  });

  it("0,0 to false", () => {
    expect(isOnlyNumbers("0,0")).toBe(false);
  });

  it("12 with sufix space to false", () => {
    expect(isOnlyNumbers("12 ")).toBe(false);
  });

  it("12 with prefix space to false", () => {
    expect(isOnlyNumbers(" 12")).toBe(false);
  });

  it("0 with prefix space to true", () => {
    expect(isOnlyNumbers("0")).toBe(true);
  });

  it("000000 with prefix space to true", () => {
    expect(isOnlyNumbers("000000")).toBe(true);
  });

  it("12 with prefix space to true", () => {
    expect(isOnlyNumbers("12")).toBe(true);
  });
});

describe("formatTime", () => {
  it("null return 00:00:00", () => {
    expect(formatTime(null)).toBe("00:00:00");
  });

  it("undefined return 00:00:00", () => {
    expect(formatTime(undefined)).toBe("00:00:00");
  });

  it("0 return 00:00:00", () => {
    expect(formatTime("0")).toBe("00:00:00");
  });

  it("01 return 01:00:00", () => {
    expect(formatTime("01")).toBe("01:00:00");
  });

  it("912 return 91:20:00", () => {
    expect(formatTime("912")).toBe("91:20:00");
  });

  it("1234 return 12:34:00", () => {
    expect(formatTime("1234")).toBe("12:34:00");
  });

  it("12345 return 12:34:50", () => {
    expect(formatTime("12345")).toBe("12:34:50");
  });

  it("123456 return 12:34:56", () => {
    expect(formatTime("123456")).toBe("12:34:56");
  });

  it("123456789 return 12:34:56", () => {
    expect(formatTime("123456789")).toBe("12:34:56");
  });

  it("000001 return 00:00:01", () => {
    expect(formatTime("000001")).toBe("00:00:01");
  });
});

describe("convertToPhoneNumber", () => {
  it('null return ""', () => {
    expect(convertToPhoneNumber(null)).toBe("");
  });

  it('undefined return ""', () => {
    expect(convertToPhoneNumber(undefined)).toBe("");
  });

  it('"" return ""', () => {
    expect(convertToPhoneNumber("")).toBe("");
  });

  it('"abc" return ""', () => {
    expect(convertToPhoneNumber("abc")).toBe("");
  });

  it('1 return "(1"', () => {
    expect(convertToPhoneNumber("1")).toBe("(1");
  });

  it('11 return "(11"', () => {
    expect(convertToPhoneNumber("11")).toBe("(11");
  });

  it('119 return "(11) 9"', () => {
    expect(convertToPhoneNumber("119")).toBe("(11) 9");
  });

  it('119876 return "(11) 9876"', () => {
    expect(convertToPhoneNumber("119876")).toBe("(11) 9876");
  });

  it('1198765 return "(11) 9876-5"', () => {
    expect(convertToPhoneNumber("1198765")).toBe("(11) 9876-5");
  });

  it('1187654321 return "(11) 8765-4321"', () => {
    expect(convertToPhoneNumber("1187654321")).toBe("(11) 8765-4321");
  });

  it('11987654321 return "(11) 98765-4321"', () => {
    expect(convertToPhoneNumber("11987654321")).toBe("(11) 98765-4321");
  });

  it("drops everything past the eleventh digit", () => {
    expect(convertToPhoneNumber("119876543219999")).toBe("(11) 98765-4321");
  });

  it("ignores characters that are not digits", () => {
    expect(convertToPhoneNumber("(11) 98765-4321")).toBe("(11) 98765-4321");
  });
});
