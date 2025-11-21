import { Router } from 'express';
import { userRouter } from '../../../contexts_/users/infrastructure/http/user.router';
// import { productRouter } from '../../contexts/2-catalog/infrastructure/http/product.router';
// import { orderRouter } from '../../contexts/3-orders/infrastructure/http/order.router';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Підключення роутерів з контекстів ---
apiRouter.use('/users', userRouter);
// apiRouter.use('/products', productRouter); // Коли ви їх створите
// apiRouter.use('/orders', orderRouter);   // Коли ви їх створите

export { apiRouter };