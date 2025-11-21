import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserMongoRepository } from '../infrastructure/repositories/user.mongo-repository';
import { AuthService } from '../infrastructure/services/auth.service';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';

const router = Router();

const userRepo = new UserMongoRepository();
const authService = new AuthService();

const createUserUseCase = new CreateUserUseCase(userRepo, authService);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);

const userController = new UserController(createUserUseCase, getUserByIdUseCase);

router.post('/register', checkApiKey, (req, res) => userController.register(req, res));

export { router as userRouter };