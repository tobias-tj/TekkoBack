import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';
import { MailService } from '../../infrastructure/email/MailServices';
import bcrypt from 'bcrypt';

export class ResetPassword {
  constructor(
    private manageParentRepo: ManageParentRepo,
    private mailService: MailService,
  ) {}

  private generateRandomPass(): string {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => charset[Math.floor(Math.random() * charset.length)],
    ).join('');
  }

  async execute(email: string): Promise<void> {
    const newPassword = this.generateRandomPass();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.manageParentRepo.updatePassword(email, hashedPassword);

    await this.mailService.sendEmail({
      to: email,
      subject: 'Recuperación de contraseña - Tekko',
      html: `${recoveryTemplate(newPassword)}`,
      text: `Hola,\n\nTu nueva contraseña temporal es: ${newPassword}\n\nPor favor, cámbiala luego de ingresar.\n\n© ${new Date().getFullYear()} Tekko App.`,
    });
  }
}

function recoveryTemplate(newPassword: string): string {
  return `
      <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Recuperación de contraseña - Tekko</title>
      <style>
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #fff; padding: 30px; margin: auto;">
      <div style="font-family: Arial, sans-serif; background-color: #fff; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dxw29ge49/image/upload/v1750362964/iconAppTekko_tnkd9l.png" alt="Tekko Logo" style="width: 150px;" />
        </div>
        <h2 style="color: #512E0C; text-align: center;">Recuperación de Contraseña</h2>
        <p style="font-size: 16px; color: #333;">Hola,</p>
        <p style="font-size: 16px; color: #333;">
          Recibimos una solicitud para restablecer tu contraseña en Tekko.
        </p>
        <p style="font-size: 16px; color: #333;">
          Tu nueva contraseña temporal es:
        </p>
        <div style="background-color: #F9D3A5; color: #512E0C; padding: 15px; border-radius: 8px; font-size: 20px; text-align: center; font-weight: bold; margin: 20px 0;">
          ${newPassword}
        </div>
        <p style="font-size: 16px; color: #333;">
          Te recomendamos cambiar esta contraseña después de iniciar sesión.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="text-align: center; font-size: 14px; color: #aaa;">
          © ${new Date().getFullYear()} Tekko App — Todos los derechos reservados
        </p>
      </div>
    </body>
    </html>
      `;
}
