import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { logger } from '../logging/logger.service';

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        
        if (!process.env.CLOUDINARY_API_KEY) {
            logger.error("Помилка конфігурації: CLOUDINARY_API_KEY не знайдено!");
        }
    }

    public uploadImage(fileBuffer: Buffer, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                    width: 512,
                    height: 512,
                    crop: 'fill',
                    gravity: 'auto',
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error('Cloudinary: результат завантаження відсутній.'));
                    }
                    resolve(result.secure_url);
                }
            );

            const bufferStream = new Readable();
            bufferStream.push(fileBuffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });
    }

    public deleteImage(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
    
                    logger.error(`[Cloudinary] Помилка видалення. Деталі: ${errorMessage}`);
                    resolve(); 
                } else {
                    logger.log(`[Cloudinary] Фото видалено: ${publicId}`);
                    resolve();
                }
            });
        });
    }

    public getPublicIdFromUrl(url: string): string | null {
        try {
            const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
            const match = url.match(regex);
            return match ? match[1] : null;
        } catch (error) {
            return null;
        }
    }
}