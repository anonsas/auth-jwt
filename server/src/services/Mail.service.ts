import * as nodemailer from "nodemailer";

export class MailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(sendTo: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: sendTo,
      subject: `Account activation on page: ${process.env.API_URL}`,
      text: "",
      html: `<div>
              <h1>To activate account press link below</h1>
              <a href="${link}">${link}</a>
            </div>`,
    });
  }
}
