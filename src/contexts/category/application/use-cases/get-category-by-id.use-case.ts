import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/repositories/i-category.repository";


export class GetCategoryByIdUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryId: string): Promise<Category | null> {
        const category = await this.categoryRepository.findById(categoryId);

        return category;
    }
}