import { CreateParentDto } from '../../domain/interfaces/dto/parent/CreateParentDto';
import { NextFunction, Request, Response } from 'express';
import { generatePinSecurity } from '../../utils/generatePinSecurity';
import { CreateKidDto } from '../../domain/interfaces/dto/kids/CreateKidDto';
import { RegisterParent } from '../../usecases/parent_register/register';
import { RegisterKid } from '../../usecases/kid_register/register';
import { LoginParent } from '../../usecases/parent_login/login';
import { logger } from '../../infrastructure/logger';
import { PinSecurity } from '../../usecases/parent_pin/pin_security';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  decodeToken,
  SECRET_KEY,
} from '../../domain/interfaces/middleware/jwtMiddleware';
import { EmailConfirm } from '../../usecases/parent_email_confirm/emailConfirm';
import { ResetPassword } from '../../usecases/paren_reset_password/resetPassword';
import { SendPinByEmail } from '../../usecases/send_pin_email/send_pin_by_email';

export class AccessCheckoutController {
  constructor(
    private registerParentUseCase: RegisterParent,
    private registerKidUseCase: RegisterKid,
    private loginParentUseCase: LoginParent,
    private accessPinSecurity: PinSecurity,
    private emailConfirm: EmailConfirm,
    private resetPasswordAccount: ResetPassword,
    private sendPinByEmail: SendPinByEmail,
  ) {}

  async loginCheckoutProcess(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const loginResult = await this.loginParentUseCase.execute(
        email,
        password,
      );

      if (!loginResult.parentId) {
        let statusCode = 401;
        let errorMessage = 'Credenciales inválidas';

        // Personalizar mensajes según el error
        if (loginResult.error === 'EMAIL_NOT_EXIST') {
          errorMessage = 'Email no registrado';
        } else if (loginResult.error === 'PASSWORD_NOT_FOUND') {
          errorMessage = 'Contraseña incorrecta';
        } else if (loginResult.error === 'PARENT_NOT_FOUND') {
          statusCode = 404;
          errorMessage = 'No se encontró perfil completo del usuario';
        }

        return res.status(statusCode).json({
          success: false,
          message: errorMessage,
          errorCode: loginResult.error,
        });
      }

      const token = jwt.sign(
        {
          parentId: loginResult.parentId,
          childrenId: loginResult.childrenId,
          email: email,
        },
        SECRET_KEY || '',
      );

      logger.info('El token generado exitosamente');

      // Login exitoso
      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
        },
      });
    } catch (error) {
      logger.error('Error inesperado en loginCheckoutProcess:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        errorCode: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async registerCheckoutProcess(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { fullNameParent, email, password, nameKid, ageKid } = req.body;

      const pinSecurity = generatePinSecurity(8);

      const createParentDTO = new CreateParentDto(
        pinSecurity,
        email,
        password,
        fullNameParent,
      );

      const parentResult =
        await this.registerParentUseCase.execute(createParentDTO);

      if (!parentResult.parentId) {
        const errorMessage =
          parentResult.error === 'EMAIL_ALREADY_EXISTS'
            ? 'El email ya está registrado'
            : 'Error al registrar la cuenta del padre';

        return res.status(409).json({
          success: false,
          message: errorMessage,
          errorCode: parentResult.error,
        });
      }

      const createKidsDTO = new CreateKidDto(
        nameKid,
        ageKid,
        parentResult.parentId,
      );

      const kidId = await this.registerKidUseCase.execute(createKidsDTO);

      if (!kidId) {
        return res.status(500).json({
          success: false,
          message: 'Error al registrar el perfil del niño',
        });
      }

      const token = jwt.sign(
        {
          parentId: parentResult.parentId,
          childrenId: kidId,
          email: email,
        },
        SECRET_KEY || '',
      );

      logger.info('El token generado exitosamente');

      return res.status(201).json({
        success: true,
        message: 'Registro completado exitosamente',
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async securityPin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { pinSecurity } = req.body;

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const pinResult = await this.accessPinSecurity.execute(
        pinSecurity,
        Number(decoded.parentId),
      );

      if (!pinResult.isValid) {
        return res.status(401).json({
          success: false,
          message: 'PIN inválido o no coincide con el padre/madre',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'PIN verificado correctamente',
        parentInfo: pinResult.parentInfo,
      });
    } catch (error) {
      logger.error('Error en securityPin controller:', error);
      next(error);
    }
  }

  async recoverAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { emailAccount } = req.body;

      const emailValid = await this.emailConfirm.execute(emailAccount);

      if (!emailValid) {
        return res.status(409).json({
          success: false,
          message: 'El correo electronico no existe en Tekko',
        });
      }

      await this.resetPasswordAccount.execute(emailAccount);
      return res.status(201).json({
        success: true,
        message: 'Nueva contraseña generada y enviada por correo.',
      });
    } catch (error) {
      next(error);
    }
  }

  async senderPinByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      await this.sendPinByEmail.execute(
        Number(decoded.parentId),
        decoded.email,
      );

      return res.status(201).json({
        success: true,
        message: 'El pin enviado correctamente.',
      });
    } catch (error) {
      next(error);
    }
  }
}
