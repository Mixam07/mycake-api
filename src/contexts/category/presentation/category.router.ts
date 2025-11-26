import { Router } from 'express';

import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '../application/use-cases/get-categories.use-case';
import { GetCategoryByIdUseCase } from '../application/use-cases/get-category-by-id.use-case';
import { GetPastryByCategoryUseCase } from '../application/use-cases/get-pastry-by-category-id.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { DeleteCategoryByIdUseCase } from '../application/use-cases/delete-category-by-id.use-case';

import { CategoryController } from './controllers/category.controller';

import { CategoryMongoRepository } from '../infrastructure/repositories/category.mongo-repository';
import { UserMongoRepository } from '../../user/infrastructure/repositories/user.mongo-repository';
import { PastryMongoRepository } from '../../pastry/infrastructure/repositories/pastry.mongo-repository';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';

import { validateCreateCategory } from './middlewares/create-category.middleware';
import { validateUpdateCategory } from './middlewares/update-category.middleware';

const router = Router();

const categoryRepository = new CategoryMongoRepository();
const pastryRepository = new PastryMongoRepository();
const userRepository = new UserMongoRepository();

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const getPastryByCategoryUseCase = new GetPastryByCategoryUseCase(pastryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryByIdUseCase = new DeleteCategoryByIdUseCase(categoryRepository, pastryRepository, userRepository);

const categoryController = new CategoryController(
    createCategoryUseCase, getCategoryByIdUseCase, getCategoriesUseCase,
    getPastryByCategoryUseCase, updateCategoryUseCase, deleteCategoryByIdUseCase,
);

router.post('/', checkApiKey, validateCreateCategory, (req, res) => categoryController.createCategory(req, res));
router.get('/', checkApiKey, (req, res) => categoryController.getCategories(req, res));
router.get('/:id', checkApiKey, (req, res) => categoryController.getCategoryById(req, res));
router.get('/:id/pastries', checkApiKey, (req, res) => categoryController.getPastryByCategoryId(req, res));
router.patch('/:id', checkApiKey, validateUpdateCategory, (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', checkApiKey, (req, res) => categoryController.deleteCategoryById(req, res));

export { router as categoryRouter };