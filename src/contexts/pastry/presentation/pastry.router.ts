import { Router } from 'express';

import { CreatePastryUseCase } from '../application/use-cases/create-pastry.use-case';
import { GetPastriesUseCase } from '../application/use-cases/get-pastries.use-case';
import { GetPastryByIdUseCase } from '../application/use-cases/get-pastry-by-id.use-casse';
import { UpdatePastryUseCase } from '../application/use-cases/update-pastry.use-case';
import { UploadPastryPhotosUseCase } from '../application/use-cases/upload-pastry-photos.use-case';
import { DeletePastryByIdUseCase } from '../application/use-cases/delete-pastry-by-id.use-case';

import { PastryController } from './controllers/pastry.controller';

import { PastryMongoRepository } from '../infrastructure/repositories/pastry.mongo-repository';
import { UserMongoRepository } from '../../user/infrastructure/repositories/user.mongo-repository';
import { CategoryMongoRepository } from '../../category/infrastructure/repositories/category.mongo-repository';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';

import { uploadMiddleware } from '../../../shared/infrastructure/http/file-upload.middleware';
import { CloudinaryService } from '../../../shared/infrastructure/storage/cloudinary.service';

import { validateCreatePastry } from './middlewares/create-pastry.middleware';
import { validateUpdatePastry } from './middlewares/update-pastry.middleware';

const router = Router();

const pastryRepository = new PastryMongoRepository();
const userRepository = new UserMongoRepository();
const categoryRepository = new CategoryMongoRepository();

const cloudinaryService = new CloudinaryService();

const createPastryUseCase = new CreatePastryUseCase(pastryRepository, userRepository, categoryRepository);
const getPastriesUseCase = new GetPastriesUseCase(pastryRepository);
const getPastryByIdUseCase = new GetPastryByIdUseCase(pastryRepository);
const updatePastryUseCase = new UpdatePastryUseCase(pastryRepository);
const uploadPastryPhotosUseCase = new UploadPastryPhotosUseCase(pastryRepository, cloudinaryService)
const deletePastryByIdUseCase = new DeletePastryByIdUseCase(pastryRepository, cloudinaryService, userRepository, categoryRepository);

const pastryController = new PastryController(
    createPastryUseCase, getPastriesUseCase, getPastryByIdUseCase,
    updatePastryUseCase, uploadPastryPhotosUseCase, deletePastryByIdUseCase
);

router.get('/', checkAuthToken, (req, res) => pastryController.getPastries(req, res));
router.get('/:id', checkAuthToken, (req, res) => pastryController.getPastryById(req, res));
router.post('/', checkAuthToken, validateCreatePastry, (req, res) => pastryController.createPastry(req, res));
router.patch('/:id', checkAuthToken, validateUpdatePastry, (req, res) => pastryController.updatePastry(req, res));
router.put('/:id/photos', checkAuthToken, uploadMiddleware, (req, res) => pastryController.uploadPhotos(req, res));
router.delete('/:id', checkAuthToken, (req, res) => pastryController.deletePastryById(req, res));

export { router as pastryRouter };