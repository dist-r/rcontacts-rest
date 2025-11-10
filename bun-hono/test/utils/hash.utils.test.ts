import { describe, it, expect } from "bun:test";
import HashUtils from "../../src/utils/hash.utils";

describe("HashUtils", () => {
  it("should hash a password and then successfully verify it", async () => {
    const password = "mysecretpassword";
    const hashedPassword = await HashUtils.hashedPassword(password);

    expect(hashedPassword).toBeString();
    expect(hashedPassword).not.toBe(password);

    const isMatch = await HashUtils.verifyPassword(hashedPassword, password);
    expect(isMatch).toBe(true);
  });

  it("should fail to verify a wrong password", async () => {
    const password = "mysecretpassword";
    const wrongPassword = "anotherpassword";
    const hashedPassword = await HashUtils.hashedPassword(password);

    const isMatch = await HashUtils.verifyPassword(hashedPassword, wrongPassword);
    expect(isMatch).toBe(false);
  });
});
