import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserMongoRepository } from '../infrastructure/repositories/user.mongo-repository';
import { AuthService } from '../infrastructure/services/auth.service';
import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';

const router = Router();

const userRepo = new UserMongoRepository();
const authService = new AuthService();

const getUserUseCase = new GetUsersUseCase(userRepo);

const userController = new UserController(getUserUseCase);

router.get('/', checkApiKey, (req, res) => userController.getUsers(req, res));

export { router as userRouter };