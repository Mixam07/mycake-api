import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserMongoRepository } from '../infrastructure/repositories/user.mongo-repository';
import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { DeleteUserByIdUseCase } from '../application/use-cases/delete-user-by-id.use-case';
import { AuthMongoRepository } from '../../auth/infrastructure/repositories/auth.mongo-repository';

const router = Router();

const userRepository = new UserMongoRepository();
const authRepository = new AuthMongoRepository();

const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository, authRepository);

const userController = new UserController(getUsersUseCase, getUserByIdUseCase, deleteUserByIdUseCase);

router.get('/', checkApiKey, (req, res) => userController.getUsers(req, res));
router.get('/:id', checkAuthToken, (req, res) => userController.getUserById(req, res));
router.delete('/:id', checkApiKey, (req, res) => userController.deleteUserById(req, res));

export { router as userRouter };