import multer from 'multer';

// Налаштовуємо Multer, щоб він зберігав файл у пам'яті (RAM)
// а не на диску сервера. Це важливо для нашої архітектури.
const storage = multer.memoryStorage();

// Фільтр, щоб приймати тільки зображення
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Дозволено завантажувати лише зображення!'), false);
  }
};

// Експортуємо готовий middleware.
// .single('image') означає, що ми очікуємо ОДИН файл у полі з назвою 'image'
export const uploadMiddleware = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Обмеження 5MB
}).single('image');