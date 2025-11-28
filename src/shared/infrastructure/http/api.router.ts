import { Router } from 'express';
import { userRouter } from '../../../contexts/user/presentation/user.router';
import { authRouter } from '../../../contexts/auth/presentation/auth.router';
import { pastryRouter } from '../../../contexts/pastry/presentation/pastry.router';
import { categoryRouter } from '../../../contexts/category/presentation/category.router';
import { reviewRouter } from '../../../contexts/review/presentation/review.router';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/pastries', pastryRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/reviews', reviewRouter);

export { apiRouter };