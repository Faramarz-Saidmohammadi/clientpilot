import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (resend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "ClientPilot <no-reply@clientpilot.app>",
      to,
      subject,
      html
    });
    return;
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
}
