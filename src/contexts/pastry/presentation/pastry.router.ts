import { Router } from 'express';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';
import { PastryController } from './controllers/pastry.controller';
import { CreatePastryUseCase } from '../application/use-cases/create-pastry.use-case';
import { PastryMongoRepository } from '../infrastructure/repositories/pastry.mongo-repository';
import { UserMongoRepository } from '../../user/infrastructure/repositories/user.mongo-repository';
import { validateCreatePastry } from './middlewares/validate-pastry.middleware';
import { GetPastriesUseCase } from '../application/use-cases/get-pastries.use-case';
import { GetPastryByIdUseCase } from '../application/use-cases/get-pastry-by-id.use-casse';
import { DeletePastryByIdUseCase } from '../application/use-cases/delete-pastry-by-id.use-case';

const router = Router();

const pastryRepository = new PastryMongoRepository();
const userRepository = new UserMongoRepository();

const createPastryUseCase = new CreatePastryUseCase(pastryRepository, userRepository);
const getPastriesUseCase = new GetPastriesUseCase(pastryRepository);
const getPastryByIdUseCase = new GetPastryByIdUseCase(pastryRepository);
const deletePastryByIdUseCase = new DeletePastryByIdUseCase(pastryRepository, userRepository);

const pastryController = new PastryController(createPastryUseCase, getPastriesUseCase, getPastryByIdUseCase, deletePastryByIdUseCase);

router.get('/', checkAuthToken, (req, res) => pastryController.getPastries(req, res));
router.get('/:id', checkAuthToken, (req, res) => pastryController.getPastryById(req, res));
router.post('/', checkAuthToken, validateCreatePastry, (req, res) => pastryController.createPastry(req, res));
router.delete('/:id', checkAuthToken, (req, res) => pastryController.deletePastryById(req, res));

export { router as pastryRouter };