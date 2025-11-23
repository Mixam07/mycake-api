import { ISellerProfile } from '../../domain/entities/user.entity';
import { IMeRepository } from '../../domain/repositories/i-me.repository';
import { PhoneAccuracyService } from '../../domain/services/phone-accuracy.service';

export class UpdateSellerProfileUseCase {
    constructor(
        private readonly meRepository: IMeRepository,
        private phoneService: PhoneAccuracyService
    ) {}

    async execute(userId: string, data: ISellerProfile) {
        if (data.phone && !this.phoneService.isCorrect(data.phone)) {
            throw new Error('Невірний формат телефону. Вкажіть у міжнародному форматі (напр., +380...)');
        }

        const user = await this.meRepository.updateSellerProfile(userId, data);

        return user;
    }
}