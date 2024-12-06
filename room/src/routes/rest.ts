import express, { RequestHandler } from 'express';
import restHandlers from '@/handlers/rest';
import { body, header, param, validationResult } from 'express-validator';

const router = express.Router();

const validator: RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).send({ errors: result.array() });
  } else {
    next();
  }
};

router.use(header('X-Letterboxd-User').isString().notEmpty());
router.get('/:id', param('id').isString().notEmpty(), validator, restHandlers.onGetRoom);
router.post('/', body('movies').isArray({ min: 1 }), validator, restHandlers.onPostRoom);
router.delete('/:id', param('id').isString().notEmpty(), validator, restHandlers.onDeleteRoom);

export default router;
