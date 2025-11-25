import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository, PaginatedCategories } from '../../domain/repositories/i-category.repository';
import { CategoryMapper } from '../mongo/category.mapper';
import { CategoryModel } from '../mongo/category.schema';

export class CategoryMongoRepository implements ICategoryRepository {
    async save(category: Category): Promise<void> {
        const rawData = CategoryMapper.toPersistence(category);
        await CategoryModel.updateOne({ _id: rawData._id }, rawData, { upsert: true });
    }

    async find(page: number = 1, limit: number = 10): Promise<PaginatedCategories> {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            CategoryModel.find()
                .skip(skip)
                .limit(limit)
                .exec(),
            CategoryModel.countDocuments().exec()
        ]);

        return {
            categories: docs.map(doc => CategoryMapper.toDomain(doc)),
            total: total
        };
    }

    async findById(categoryId: string): Promise<Category | null> {
        const doc = await CategoryModel.findById(categoryId).exec();
        return doc ? CategoryMapper.toDomain(doc) : null;
    }

    async findByName(name: string) {
        const doc = await CategoryModel.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        }).exec();
        return doc ? CategoryMapper.toDomain(doc) : null;
    }

    async deleteById(categoryId: string): Promise<Category | null> {
        const doc = await CategoryModel.findByIdAndDelete(categoryId).exec();
        return doc ? CategoryMapper.toDomain(doc) : null;
    }
}