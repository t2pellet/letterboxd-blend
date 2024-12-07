import { RouteError } from '@/types';
import { validationResult } from 'express-validator';
import { HttpStatusCodes } from '@/constants/http';
import { NextFunction, Request, Response } from 'express';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Failed parameter validation',
      result.array(),
    );
  }
  next();
};

export default validate;
