import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';

import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';

import { AuthMongoRepository } from '../infrastructure/repositories/auth.mongo-repository';
import { UserMongoRepository } from '../../user/infrastructure/repositories/user.mongo-repository';

import { AuthService } from '../infrastructure/services/auth.service';
import { PasswordStrengthService } from '../domain/services/password-strength.service';

import { checkApiKey } from '../../../shared/infrastructure/http/auth.middleware';
import { CookieService } from '../../../shared/infrastructure/http/cookie.service';

const router = Router();

const authRepository = new AuthMongoRepository();
const userRepository = new UserMongoRepository();

const authService = new AuthService();
const passwordService = new PasswordStrengthService();
const cookieService = new CookieService();

const registerUseCase = new RegisterUseCase(
    authRepository,
    userRepository,
    authService,
    passwordService
);

const loginUseCase = new LoginUseCase(
    authRepository,
    userRepository,
    authService
);

const authController = new AuthController(registerUseCase, loginUseCase, cookieService);

router.post('/register', checkApiKey, (req, res) => authController.register(req, res));
router.post('/login', checkApiKey, (req, res) => authController.login(req, res));
router.post('/logout', checkApiKey, (req, res) => authController.logout(req, res));

export { router as authRouter };