import { Pastry } from '../../domain/entities/pastry.entity';
import { IPastryRepository } from '../../domain/repositories/i-pastry.repository';

export class GetPastryByIdUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
    ) {}

    async execute(id: string): Promise<Pastry | null> {
        const pastry = await this.pastryRepository.findById(id);

        return pastry;
    }
}