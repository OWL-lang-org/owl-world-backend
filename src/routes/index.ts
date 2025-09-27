import { Application, Router } from 'express';
import usersRouter from './users.route';

export default (app : Application) => {
    const router = Router();
    app.use('/api', router);
    usersRouter(router);
}