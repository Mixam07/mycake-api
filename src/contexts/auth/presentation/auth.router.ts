import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';

import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';

import { AuthMongoRepository } from '../infrastructure/repositories/auth.mongo-repository';
import { UserMongoRepository } from '../../user/infrastructure/repositories/user.mongo-repository';

import { AuthService } from '../infrastructure/services/auth.service';
import { PasswordStrengthService } from '../domain/services/password-strength.service';

import { checkApiKey } from '../../../shared/infrastructure/http/auth.middleware';

const router = Router();

const authRepo = new AuthMongoRepository();
const userRepo = new UserMongoRepository();

const authService = new AuthService();
const passwordService = new PasswordStrengthService();

const registerUseCase = new RegisterUseCase(
    authRepo,
    userRepo,
    authService,
    passwordService
);

const loginUseCase = new LoginUseCase(
    authRepo,
    userRepo,
    authService
);

const authController = new AuthController(registerUseCase, loginUseCase);

router.post('/register', checkApiKey, (req, res) => authController.register(req, res));

router.post('/login', checkApiKey, (req, res) => authController.login(req, res));

export { router as authRouter };