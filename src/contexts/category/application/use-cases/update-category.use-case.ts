import slugify from "slugify";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/repositories/i-category.repository";
import { UpdateCategoryDto } from "../../presentation/dtos/category.dto";

export class UpdateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryId: string, dto: UpdateCategoryDto): Promise<Category | null> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            return null
        }

        const slug = slugify(dto.name, { lower: true, strict: true });

        category.updateCategory({
            ...dto,
            slug
        });

        await this.categoryRepository.save(category);

        return category;
    }
}