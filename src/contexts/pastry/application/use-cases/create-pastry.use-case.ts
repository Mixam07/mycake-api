import { Types } from 'mongoose';

import { Pastry } from '../../domain/entities/pastry.entity';
import { IPastryRepository } from '../../domain/repositories/i-pastry.repository';
import { CreatePastryDto } from '../../presentation/dtos/pastry.dto';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';

export class CreatePastryUseCase {
    constructor(
        private pastryRepository: IPastryRepository,
        private userRepository: IUserRepository,
    ) {}

    async execute(dto: CreatePastryDto, confectionerId: string): Promise<Pastry> {
        const confectioner = await this.userRepository.findById(confectionerId);

        if (!confectioner) {
            throw new Error('Користувач не знайдений');
        }

        const pastryId = new Types.ObjectId().toString();

        const pastry = new Pastry(
            pastryId,
            dto.category,
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

        await this.pastryRepository.save(pastry);
        await this.userRepository.save(confectioner);

        return pastry;
    }
}