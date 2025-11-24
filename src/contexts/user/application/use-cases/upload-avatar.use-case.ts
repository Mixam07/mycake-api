import { CloudinaryService } from '../../../../shared/infrastructure/storage/cloudinary.service';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/i-user.repository';

export class UploadAvatarUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async execute(userId: string, fileBuffer: Buffer): Promise<User | null> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return null
        }

        if (user.avatarUrl) {
            const publicId = this.cloudinaryService.getPublicIdFromUrl(user.avatarUrl);
            
            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
            }
        }

        const avatarUrl = await this.cloudinaryService.uploadImage(fileBuffer);

        user.changeAvatar(avatarUrl);

        await this.userRepository.save(user);

        return user;
    }
}