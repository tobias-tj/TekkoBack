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

export class AccessCheckoutController {
  constructor(
    private registerParentUseCase: RegisterParent,
    private registerKidUseCase: RegisterKid,
    private loginParentUseCase: LoginParent,
    private accessPinSecurity: PinSecurity,
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

      // Login exitoso
      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          parentId: loginResult.parentId,
          childrenId: loginResult.childrenId,
          // Considera incluir un token JWT aquí si implementas autenticación
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

      return res.status(201).json({
        success: true,
        message: 'Registro completado exitosamente',
        data: {
          parentId: parentResult.parentId,
          childrenId: kidId,
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

      const { pinSecurity, parentId } = req.body;

      const pinResult = await this.accessPinSecurity.execute(
        pinSecurity,
        parentId,
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
}
