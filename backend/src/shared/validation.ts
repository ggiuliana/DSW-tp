import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

  const result = schema.safeParse(req.body);

  if (!result.success) {

    return res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });

  }

  req.body = result.data;

  next();

};

export const validateParams = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {

  const result = schema.safeParse(req.params);

  if (!result.success) {

    return res.status(400).json({ error: 'Parámetros inválidos', details: result.error.flatten() });

  }

  next();

};

export function esMailValido(mail: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())
}
