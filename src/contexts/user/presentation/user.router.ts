import { Router } from 'express';

import { DeleteUserByIdUseCase } from '../application/use-cases/delete-user-by-id.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { UpdateSellerProfileUseCase } from '../application/use-cases/update-seller-profile.use-case';

import { UserController } from './controllers/user.controller';
import { MeController } from './controllers/me.controller';

import { UserMongoRepository } from '../infrastructure/repositories/user.mongo-repository';
import { MeMongoRepository } from '../infrastructure/repositories/me.mongo-repository';
import { AuthMongoRepository } from '../../auth/infrastructure/repositories/auth.mongo-repository';

import { PhoneAccuracyService } from '../domain/services/phone-accuracy.service';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';

const router = Router();

const userRepository = new UserMongoRepository();
const meRepository = new MeMongoRepository();
const authRepository = new AuthMongoRepository();

const phoneService = new PhoneAccuracyService();

const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository, authRepository);
const updateSellerProfileUseCase = new UpdateSellerProfileUseCase(meRepository, phoneService)

const userController = new UserController(getUsersUseCase, getUserByIdUseCase, deleteUserByIdUseCase);
const meController = new MeController(getUserByIdUseCase, updateSellerProfileUseCase);

router.get('/', checkApiKey, (req, res) => userController.getUsers(req, res));
router.get('/me', checkAuthToken, (req, res) => meController.getMe(req, res));
router.patch('/me/profile', checkAuthToken, (req, res) => meController.updateSellerProfile(req, res));
router.get('/:id', checkAuthToken, (req, res) => userController.getUserById(req, res));
router.delete('/:id', checkApiKey, (req, res) => userController.deleteUserById(req, res));

export { router as userRouter };