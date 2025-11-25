import { Pastry } from "../../../pastry/domain/entities/pastry.entity";
import { IPastryRepository } from "../../../pastry/domain/repositories/i-pastry.repository";

export class GetPastryByConfectionerUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
    ) {}

    async execute(userId: string): Promise<Pastry[]> {
        const pastries = await this.pastryRepository.findByConfectionerId(userId);

        return pastries;
    }
}