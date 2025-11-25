import { ICategoryRepository, PaginatedCategories } from "../../domain/repositories/i-category.repository";

export class GetCategoriesUseCase {
    constructor(private readonly categoriesRepository: ICategoryRepository) {}

    async execute(page: number = 1, limit: number = 10): Promise<PaginatedCategories> {
        const safeLimit = limit > 100 ? 100 : limit;

        const users = await this.categoriesRepository.find(page, safeLimit);

        return users;
    }
}