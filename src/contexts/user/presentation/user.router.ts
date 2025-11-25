import { Router } from 'express';

import { DeleteUserByIdUseCase } from '../application/use-cases/delete-user-by-id.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { UpdateSellerProfileUseCase } from '../application/use-cases/update-seller-profile.use-case';
import { UploadAvatarUseCase } from '../application/use-cases/upload-avatar.use-case';

import { UserController } from './controllers/user.controller';
import { MeController } from './controllers/me.controller';

import { UserMongoRepository } from '../infrastructure/repositories/user.mongo-repository';
import { AuthMongoRepository } from '../../auth/infrastructure/repositories/auth.mongo-repository';

import { PhoneAccuracyService } from '../domain/services/phone-accuracy.service';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';
import { CloudinaryService } from '../../../shared/infrastructure/storage/cloudinary.service';
import { uploadMiddleware } from '../../../shared/infrastructure/http/file-upload.middleware';
import { validateUpdateProfile } from './middlewares/validate-profile.middleware';
import { PastryMongoRepository } from '../../pastry/infrastructure/repositories/pastry.mongo-repository';
import { GetPastryByConfectionerUseCase } from '../application/use-cases/get-pastry-by-confectioner.use-case';

const router = Router();

const userRepository = new UserMongoRepository();
const authRepository = new AuthMongoRepository();
const pastryRepository = new PastryMongoRepository();

const phoneService = new PhoneAccuracyService();
const cloudinaryService = new CloudinaryService();

const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getPastryByConfectionerCase = new GetPastryByConfectionerUseCase(pastryRepository);
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository, authRepository);
const updateSellerProfileUseCase = new UpdateSellerProfileUseCase(userRepository, phoneService);
const uploadAvatarUseCase = new UploadAvatarUseCase(userRepository, cloudinaryService);

const userController = new UserController(getUsersUseCase, getUserByIdUseCase, deleteUserByIdUseCase, getPastryByConfectionerCase);
const meController = new MeController(getUserByIdUseCase, updateSellerProfileUseCase, uploadAvatarUseCase);

router.get('/', checkApiKey, (req, res) => userController.getUsers(req, res));
router.get('/me', checkAuthToken, (req, res) => meController.getMe(req, res));
router.patch('/me/profile', checkAuthToken, validateUpdateProfile, (req, res) => meController.updateSellerProfile(req, res));
router.post('/me/profile/avatar', uploadMiddleware, checkAuthToken, (req, res) => meController.uploadAvatar(req, res));
router.get('/:id', checkAuthToken, (req, res) => userController.getUserById(req, res));
router.get('/:id/pastries', checkAuthToken, (req, res) => userController.getPastriesByConfectioner(req, res));
router.delete('/:id', checkApiKey, (req, res) => userController.deleteUserById(req, res));

export { router as userRouter };