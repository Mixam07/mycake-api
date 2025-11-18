import { Router, Request, Response } from 'express';
import { UserMongoRepository } from '../persistence/user.mongo.repository';
import { LoginUserUseCase } from '../../application/login-user.use-case';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { GetUsersUseCase } from '../../application/get-users.use-case';
import { GetUserByIdUseCase } from '../../application/get-user-by-id.use-case';

import { checkAuthToken, checkApiKey } from '../../../../shared/infrastructure/http/auth.middleware';
import { UserRole } from '../../domin/user.model';
import { DeleteUserByIdUseCase } from '../../application/delete-user-by-id.use-case';
import { UpdateSellerProfileUseCase } from '../../application/update-seller-profile.use-case';

const userRouter = Router();

const userRepository = new UserMongoRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository);
const updateSellerProfileUseCase = new UpdateSellerProfileUseCase(userRepository);

userRouter.post('/register', checkApiKey, async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        
        const user = await createUserUseCase.execute({ name, email, password, role });

        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRouter.post('/login', checkApiKey, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const data = await loginUserUseCase.execute({ email, password });
 
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRouter.get('/me', checkAuthToken, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Помилка автентифікації' });
        }

        const currentUserId = req.user.id;

        const user = await getUserByIdUseCase.execute(currentUserId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Користувача не знайдено' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.patch('/me/profile', checkAuthToken, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Помилка автентифікації' });
        }

        if (req.user.role !== 'Seller') {
            return res.status(403).json({ message: 'Доступ заборонено: Тільки продавці можуть оновлювати профіль' });
        }
        
        const updatedUser = await updateSellerProfileUseCase.execute(req.user.id, req.body);
        
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRouter.delete('/me', checkAuthToken, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Помилка автентифікації' });
        }
        console.log(req.user)

        const currentUserId = req.user.id;

        const user = await deleteUserByIdUseCase.execute(currentUserId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Користувача не знайдено' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.get('/', checkAuthToken, async (req: Request, res: Response) => {
    try {
        const role = req.query.role as UserRole | undefined;

        if (role && role !== 'Buyer' && role !== 'Seller') {
            return res.status(400).json({ message: 'Невірний тип ролі' });
        }

        const users = await getUsersUseCase.execute(role);
        
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.get('/:id', checkAuthToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await getUserByIdUseCase.execute(userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Користувача не знайдено' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.delete('/:id', checkApiKey, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await deleteUserByIdUseCase.execute(userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Користувача не знайдено' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { userRouter };