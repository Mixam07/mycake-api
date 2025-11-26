import { CloudinaryService } from "../../../../shared/infrastructure/storage/cloudinary.service";
import { IAuthRepository } from "../../../auth/domain/repositories/i-auth.repository";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/i-user.repository";

export class DeleteUserByIdUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly authRepository: IAuthRepository
    ) {}

    async execute(userId: string): Promise<User | null> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return null;
        }

        if (user.avatarUrl) {
            const publicId = this.cloudinaryService.getPublicIdFromUrl(user.avatarUrl);
            
            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
            }
        }

        await Promise.all([
            this.userRepository.deleteById(userId),
            this.authRepository.deleteById(userId)
        ]);

        return user;
    }
}