import { Router } from 'express';
import { userRouter } from '../../../contexts/user/presentation/user.router';
import { authRouter } from '../../../contexts/auth/presentation/auth.router';
import { pastryRouter } from '../../../contexts/pastry/presentation/pastry.router';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/pastries', pastryRouter);

export { apiRouter };