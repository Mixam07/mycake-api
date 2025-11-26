import { Pastry } from '../../domain/entities/pastry.entity';
import { IPastryRepository } from '../../domain/repositories/i-pastry.repository';
import { UpdatePastryDto } from '../../presentation/dtos/pastry.dto';

export class UpdatePastryUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
    ) {}

    async execute(dto: UpdatePastryDto,id: string): Promise<Pastry | null> {
        const pastry = await this.pastryRepository.findById(id);

        if (!pastry) {
            return null
        }

        pastry.updatePastry(dto);

        await this.pastryRepository.save(pastry);

        return pastry;
    }
}