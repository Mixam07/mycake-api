import { Pastry } from "../../../pastry/domain/entities/pastry.entity";
import { IPastryRepository } from "../../../pastry/domain/repositories/i-pastry.repository";

export class GetPastryByCategoryUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
    ) {}

    async execute(categoryId: string): Promise<Pastry[]> {
        const pastries = await this.pastryRepository.findByCategoryId(categoryId);

        return pastries;
    }
}