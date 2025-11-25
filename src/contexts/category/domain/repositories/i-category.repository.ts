import { Category } from "../entities/category.entity";

export interface PaginatedCategories {
    categories: Category[];
    total: number;
}

export interface ICategoryRepository {
    save(category: Category): Promise<void>;
    find(page: number, limit: number): Promise<PaginatedCategories>;
    findById(categoryId: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    deleteById(categoryId: string): Promise<Category | null>
}