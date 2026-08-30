import crypto from "crypto";

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1_000;

function getSecret() {
  const secret = process.env.INVOICE_LINK_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing INVOICE_LINK_SECRET or AUTH_SECRET");
  return secret;
}

function signature(invoiceId: string, expiresAt: number, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${invoiceId}.${expiresAt}`)
    .digest("base64url");
}

export function createInvoiceAccessToken(
  invoiceId: string,
  options: { now?: number; ttlMs?: number; secret?: string } = {}
) {
  const expiresAt =
    (options.now ?? Date.now()) + (options.ttlMs ?? DEFAULT_TTL_MS);
  const secret = options.secret ?? getSecret();
  return `${expiresAt}.${signature(invoiceId, expiresAt, secret)}`;
}

export function verifyInvoiceAccessToken(
  invoiceId: string,
  token: string | null,
  options: { now?: number; secret?: string } = {}
) {
  if (!token) return false;
  const [expiresAtValue, suppliedSignature, ...extra] = token.split(".");
  if (!expiresAtValue || !suppliedSignature || extra.length > 0) return false;

  const expiresAt = Number(expiresAtValue);
  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= (options.now ?? Date.now())
  )
    return false;

  let secret: string;
  try {
    secret = options.secret ?? getSecret();
  } catch {
    return false;
  }

  const expectedSignature = signature(invoiceId, expiresAt, secret);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}
