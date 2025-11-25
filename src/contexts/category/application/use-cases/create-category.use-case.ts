import { Types } from 'mongoose';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/i-category.repository';
import { CreateCategoryDto } from '../../presentation/dtos/category.dto';
import slugify from 'slugify';

export class CreateCategoryUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(dto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoryRepository.findByName(dto.name);

        if (existingCategory) {
            throw new Error(`Категорія з назвою '${dto.name}' вже існує`);
        }

        const categoryId = new Types.ObjectId().toString();
        const slug = slugify(dto.name, { lower: true, strict: true });

        const category = new Category(
            categoryId,
            dto.name,
            slug
        )

        this.categoryRepository.save(category);

        return category;
    }
}