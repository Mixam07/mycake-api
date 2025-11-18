import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Цей клас - наша "інфраструктура" для завантаження
export class CloudinaryService {
  constructor() {
    // Конфігуруємо Cloudinary (він автоматично візьме ключі з process.env)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Завантажує буфер файлу (з req.file.buffer) у Cloudinary
   * @param fileBuffer - Буфер файлу з Multer
   * @returns Promise, який повертає безпечний URL (https://)
   */
  public uploadImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      // Створюємо стрім для завантаження
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cakes', // Назва папки у вашому Cloudinary
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary: результат завантаження відсутній.'));
          }
          // Повертаємо безпечний URL
          resolve(result.secure_url);
        }
      );

      // Конвертуємо наш буфер у Readable Stream і "годуємо" ним Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null); // Сигнал про кінець файлу
      bufferStream.pipe(uploadStream);
    });
  }
}