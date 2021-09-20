import { Router } from 'express';

import usersRouter from './user.routes';
import sistemaRouter from './sistema.routes';

const routes = Router();

routes.use('/', usersRouter);
routes.use('/', sistemaRouter);

export default routes;