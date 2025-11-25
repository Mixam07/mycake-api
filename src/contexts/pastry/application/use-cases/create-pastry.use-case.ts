import { Types } from 'mongoose';

import { Pastry } from '../../domain/entities/pastry.entity';
import { IPastryRepository } from '../../domain/repositories/i-pastry.repository';
import { CreatePastryDto } from '../../presentation/dtos/pastry.dto';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';
import { ICategoryRepository } from '../../../category/domain/repositories/i-category.repository';

export class CreatePastryUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
        private readonly userRepository: IUserRepository,
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(dto: CreatePastryDto, confectionerId: string): Promise<Pastry> {
        const confectioner = await this.userRepository.findById(confectionerId);

        if (!confectioner) {
            throw new Error('Користувач не знайдений');
        }

        const category = await this.categoryRepository.findById(dto.categoryId);

        if (!category) {
            throw new Error('Категорія не знайдена');
        }

        const pastryId = new Types.ObjectId().toString();

        const pastry = new Pastry(
            pastryId,
            category.id,
            "",
            dto.status,
            dto.images,
            dto.name,
            dto.price,
            dto.description,
            dto.tags,
            dto.weight,
            dto.fillings,
            dto.additionalServices,
            dto.minWeight,
            dto.maxWeight,
            confectioner.id
        );

        confectioner.addPastryId(pastryId);
        category.addPastryId(pastryId);

        await this.pastryRepository.save(pastry);
        await this.userRepository.save(confectioner);
        await this.categoryRepository.save(category);

        return pastry;
    }
}