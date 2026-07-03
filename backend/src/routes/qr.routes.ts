import { Router } from 'express';
import Joi from 'joi';
import { badRequest, notFound } from '../utils/http-error';
import { createQrCode, getQrCode, listQrCodes } from '../services/qr.service';

const router = Router();

const createSchema = Joi.object({
  purpose: Joi.string().valid('registration', 'payment', 'event', 'custom').required(),
  title: Joi.string().trim().min(3).max(120).required(),
  description: Joi.string().trim().max(1000).allow('', null),
  targetUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  amount: Joi.when('purpose', { is: 'payment', then: Joi.number().positive().precision(2).required(), otherwise: Joi.number().positive().precision(2).optional() }),
  currency: Joi.when('amount', { is: Joi.exist(), then: Joi.string().uppercase().length(3).required(), otherwise: Joi.string().uppercase().length(3).optional() }),
  metadata: Joi.object().max(20).optional()
});

router.get('/', async (_req, res, next) => {
  try { res.json({ data: await listQrCodes() }); } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) throw badRequest(error.message);
    const created = await createQrCode(value);
    res.status(201).json({ data: created });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await getQrCode(req.params.id);
    if (!item) throw notFound('QR code not found');
    res.json({ data: item });
  } catch (error) { next(error); }
});

export default router;
