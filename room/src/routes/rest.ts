import express, { RequestHandler } from 'express';
import restHandlers from '@/handlers/rest';
import { body, header, oneOf, param, validationResult } from 'express-validator';

const router = express.Router();

const validator: RequestHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).send({ errors: result.array() });
  } else {
    next();
  }
};

router.use(header('X-Letterboxd-User').isString().notEmpty(), validator);
router.post('/', restHandlers.onPostRoom);
router.get('/:id', param('id').isString().notEmpty(), validator, restHandlers.onGetRoom);
router.put(
  '/:id',
  param('id').isString().notEmpty(),
  body('movies').isArray({ min: 1 }).optional(),
  validator,
  restHandlers.onPutRoom,
);
router.post('/:id/start', param('id').isString().notEmpty(), validator, restHandlers.onStartRoom);
router.delete('/:id', param('id').isString().notEmpty(), validator, restHandlers.onDeleteRoom);

export default router;
