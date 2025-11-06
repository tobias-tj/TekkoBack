import axios from 'axios';

export class MailService {
  private SENDER_EMAIL = 'team@yvagacore.com';
  private API_TOKEN = process.env.MAILTRAP_API_TOKEN!;

  async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    try {
      const response = await axios.post(
        'https://send.api.mailtrap.io/api/send',
        {
          from: {
            email: this.SENDER_EMAIL,
            name: 'Tekko Notificaciones',
          },
          to: [{ email: to }],
          subject,
          text,
          html,
          category: 'Integration Test', // opcional
        },
        {
          headers: {
            Authorization: `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Correo enviado con éxito a', to, response.status);
    } catch (error: any) {
      console.error(
        '❌ Error al enviar correo:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }
}
