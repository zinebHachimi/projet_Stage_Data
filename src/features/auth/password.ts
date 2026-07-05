import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const hashedBuffer = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(key, "hex");

  if (storedBuffer.length !== hashedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, hashedBuffer);
}
