import { IPastryRepository, PaginatedPastries } from '../../domain/repositories/i-pastry.repository';

export class GetPastriesUseCase {
    constructor(
        private readonly pastryRepository: IPastryRepository,
    ) {}

    async execute(page: number = 1, limit: number = 10): Promise<PaginatedPastries> {
        const safeLimit = limit > 100 ? 100 : limit;

        const pastry = await this.pastryRepository.find(page, safeLimit);

        return pastry;
    }
}