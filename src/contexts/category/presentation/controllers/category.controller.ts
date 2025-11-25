import { Request, Response } from 'express';
import { CategoryResponseDTO } from '../dtos/category.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { GetCategoryByIdUseCase } from '../../application/use-cases/get-category-by-id.use-case';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { DeleteCategoryByIdUseCase } from '../../application/use-cases/delete-category-by-id.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { GetPastryByCategoryUseCase } from '../../application/use-cases/get-pastry-by-category-id.use-case';
import { PastryResponseDto } from '../../../pastry/presentation/dtos/pastry.dto';

export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private readonly getCategoriesUseCase: GetCategoriesUseCase,
        private readonly getPastryByCategoryUseCase: GetPastryByCategoryUseCase,
        private readonly updateCategoryUseCase: UpdateCategoryUseCase,
        private readonly deleteCategoryByIdUseCase: DeleteCategoryByIdUseCase,
    ) {}

    async createCategory(req: Request, res: Response) {
        try {
            const pastry = await this.createCategoryUseCase.execute(req.body);

            const response = CategoryResponseDTO.fromEntity(pastry)

            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
             const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { categories, total } = await this.getCategoriesUseCase.execute(page, limit);
            
            res.status(200).json({
                data: CategoryResponseDTO.fromEntities(categories),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCategoryById(req: Request, res: Response) {
        try {
            const category = await this.getCategoryByIdUseCase.execute(req.params.id);

            if (!category) {
                return res.status(404).json({ message: 'Категорію не знайдено' })
            }

            const response = CategoryResponseDTO.fromEntity(category);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPastryByCategoryId(req: Request, res: Response) {
        try {
            const pastries = await this.getPastryByCategoryUseCase.execute(req.params.id);

            if (!pastries) {
                return res.status(404).json({ message: 'Категорію не знайдено' })
            }

            const response = PastryResponseDto.fromEntities(pastries);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const category = await this.updateCategoryUseCase.execute(req.params.id, req.body);

            if (!category) {
                return res.status(404).json({ message: 'Категорію не знайдено' })
            }

            const response = CategoryResponseDTO.fromEntity(category);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCategoryById(req: Request, res: Response) {
        try {
            const category = await this.deleteCategoryByIdUseCase.execute(req.params.id);

            if (!category) {
                return res.status(404).json({ message: 'Категорію не знайдено' })
            }

            const response = CategoryResponseDTO.fromEntity(category);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}