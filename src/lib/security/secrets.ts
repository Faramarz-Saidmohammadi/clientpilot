import crypto from "crypto";

export function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function hasValidBearerToken(
  header: string | null,
  secret: string | undefined
) {
  if (!header?.startsWith("Bearer ") || !secret) return false;
  return secureCompare(header.slice("Bearer ".length), secret);
}
