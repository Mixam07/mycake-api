import { IUserRepository } from '../domin/i-user.repository';
import { IUser } from '../domin/user.model';
import { CloudinaryService } from '../../../shared/infrastructure/storage/cloudinary.service';
import { logger } from '../../../shared/infrastructure/logging/logger.service';

export class UploadAvatarUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, fileBuffer: Buffer, cloudinaryService: CloudinaryService): Promise<IUser> {
        const currentUser = await this.userRepository.findById(userId);

        if (!currentUser) {
            throw new Error('Користувача не знайдено');
        }

        if (currentUser.avatarUrl) {
            const publicId = cloudinaryService.getPublicIdFromUrl(currentUser.avatarUrl);
            
            if (publicId) {
                logger.log(`[UploadAvatarUseCase] Видаляю старий аватар: ${publicId}`);
                await cloudinaryService.deleteImage(publicId);
            }
        }

        const avatarUrl = await cloudinaryService.uploadImage(fileBuffer);

        const updatedUser = await this.userRepository.updateAvatar(userId, avatarUrl);

        if (!updatedUser) {
            throw new Error('Користувача не знайдено');
        }

        return updatedUser;
    }
}