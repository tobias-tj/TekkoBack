import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

interface DecodedToken {
  parentId: string;
  childrenId: number;
  email: string;
}

dotenv.config();
const key = process.env.JWT_PRIVATE_KEY;

export const SECRET_KEY = key;

if (!SECRET_KEY) {
  throw new Error(
    'Falta la clave secreta JWT (JWT_PRIVATE_KEY) en las variables de entorno.',
  );
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as any;
    // Extraer los datos que necesitas
    return {
      parentId: decoded.parentId,
      childrenId: decoded.childrenId,
      email: decoded.email,
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
