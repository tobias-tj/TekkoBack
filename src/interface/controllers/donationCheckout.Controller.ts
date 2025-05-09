import { NextFunction, Request, Response } from 'express';
import stripe from '../../utils/stripe';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

export class DonationCheckoutController {
  constructor() {}

  async createPaymentDonation(req: Request, res: Response, next: NextFunction) {
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

    logger.info('Validacion de token cumplida exitosamente');

    const { amount, currency, email, fullName } = req.body;
    logger.info('Solicitud recibida para crear un PaymentIntent');
    try {
      logger.info('Creando PaymentIntent con Stripe...');

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          name: fullName,
          email: email,
        },
      });

      logger.info(
        'Se confirma pago realizado con exito',
        paymentIntent.client_secret,
      );
      logger.info('PaymentIntent creado exitosamente');
      logger.debug(`Client secret generado: ${paymentIntent.client_secret}`);

      return res
        .status(200)
        .json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      logger.error('Error al crear el PaymentIntent', {
        message: error.message,
        stack: error.stack,
        details: error,
      });
      next(error);
    }
  }
}
