import slugify from "slugify";
import { Category } from "../../domain/entities/category.entity";
import { UpdateCategoryParams } from "../../domain/entities/category.type";
import { ICategoryRepository } from "../../domain/repositories/i-category.repository";

export class UpdateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryId: string, data: UpdateCategoryParams): Promise<Category | null> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            return null
        }

        const slug = slugify(data.name, { lower: true, strict: true });

        category.updateCategory({
            ...data,
            slug
        });

        await this.categoryRepository.save(category);

        return category;
    }
}