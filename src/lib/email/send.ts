import { Resend } from "resend";

function getEmailClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

export async function sendEmail(to: string, subject: string, html: string) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("Missing EMAIL_FROM");

  const { error } = await getEmailClient().emails.send({
    from,
    to,
    subject,
    html
  });

  if (error) {
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
