import { express } from '../../types';
import { Request, Response } from 'express';
const customRouter = express.Router();
const customController = require('../controllers/customController');

customRouter.post('/test', customController.testCustomRoute, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.valid);
});

customRouter.post('/queries', customController.testCustomRoute, customController.addCustomRoute, (req: Request, res: Response) => {
  const status = res.locals.addedRoute ? 200 : 400;
  return res.status(status).json(res.locals.addedRoute);
});

module.exports = customRouter;