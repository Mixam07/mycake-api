import { User } from '../../domain/entities/user.entity';
import { ISellerProfile } from '../../domain/entities/user.type';
import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { PhoneAccuracyService } from '../../domain/services/phone-accuracy.service';

export class UpdateSellerProfileUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private phoneService: PhoneAccuracyService
    ) {}

    async execute(userId: string, data: ISellerProfile): Promise<User | null> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return null
        }

        if (data.phone && !this.phoneService.isCorrect(data.phone)) {
            throw new Error('Невірний формат телефону. Вкажіть у міжнародному форматі (напр., +380...)');
        }

        user.updateSellerProfile(data);

        await this.userRepository.save(user);

        return user;
    }
}