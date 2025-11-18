import { Request, Response, Router } from 'express';
import { userRouter } from '../../../contexts/users/infrastructure/http/user.router';
import { uploadMiddleware } from './file-upload.middleware';
import { CloudinaryService } from '../storage/cloudinary.service';
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

apiRouter.post('/test-upload', uploadMiddleware, async (req: Request, res: Response) => {
  try {
    // 1. Перевіряємо, чи Multer успішно обробив файл
    if (!req.file) {
      return res.status(400).json({ message: 'Файл з полем "image" не надано' });
    }

    console.log('[TEST UPLOAD] Отримано файл:', req.file.originalname, req.file.mimetype);

    // 2. Ініціалізуємо сервіс Cloudinary "на льоту"
    const cloudinaryService = new CloudinaryService();
    
    // 3. Завантажуємо буфер (який Multer зберіг у RAM)
    const imageUrl = await cloudinaryService.uploadImage(req.file.buffer);

    console.log('[TEST UPLOAD] Файл успішно завантажено:', imageUrl);

    // 4. Повертаємо успішну відповідь
    res.status(200).json({
      message: 'Файл успішно завантажено на Cloudinary (без збереження в БД)',
      url: imageUrl,
      fileName: req.file.originalname,
      size: req.file.size,
    });

  } catch (error: any) {
    console.error('[TEST UPLOAD] Помилка:', error);
    res.status(500).json({ message: 'Помилка під час завантаження файлу', error: error.message });
  }
});

export { apiRouter };