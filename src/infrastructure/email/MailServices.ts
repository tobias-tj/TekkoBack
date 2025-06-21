import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER!,
      pass: process.env.MAILTRAP_PASS!,
    },
  });

  async sendEmail({ to, subject, html }: MailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Tekko Notificaciones" <team@yvagacore.tech>',
        to,
        subject,
        html,
      });
      console.log('Correo enviado con éxito a', to);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }
}
