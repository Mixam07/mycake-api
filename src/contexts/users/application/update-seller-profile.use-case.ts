import { IUserRepository } from '../domin/i-user.repository';
import { IUser, IUpdateSellerProfileData } from '../domin/user.model';
import { isValidPhoneNumber } from 'libphonenumber-js';

export class UpdateSellerProfileUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, data: IUpdateSellerProfileData): Promise<IUser> {
        if (data.phone !== undefined) {
            if (!isValidPhoneNumber(data.phone, 'UA')) {
                throw new Error('Невірний формат телефону. Вкажіть у міжнародному форматі (напр., +380...)');
            }
        }

        const updatedUser = await this.userRepository.updateSellerProfile(userId, data);

        if (!updatedUser) {
            throw new Error('Користувача не знайдено');
        }

        return updatedUser;
    }
}