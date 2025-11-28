import { Request, Response } from 'express';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserResponseDTO } from '../dtos/user.dto';
import { UpdateSellerProfileUseCase } from '../../application/use-cases/update-seller-profile.use-case';
import { UploadAvatarUseCase } from '../../application/use-cases/upload-avatar.use-case';

export class MeController {
    constructor(
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateSellerProfileUseCase: UpdateSellerProfileUseCase,
        private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    ) {}

    async getMe(req: Request, res: Response) {
        try {
            const id = req.user?.id;

            if (!id) {
                return res.status(401).json({ message: 'Неавторизовано' });
            }

            const user = await this.getUserByIdUseCase.execute(id);

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' })
            }

            const response = UserResponseDTO.fromEntity(user);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateSellerProfile(req: Request, res: Response) {
        try {
            if (!req.body) {
                return res.status(400).json({ message: 'Додайте якусь інформацію для зміни' })
            }
            
            const id = req.user?.id;
            const role = req.user?.role;

            if (!id) {
                return res.status(401).json({ message: 'Неавторизовано' });
            }

            if (role !== 'Seller') {
                return res.status(403).json({ message: 'Доступ заборонено: Тільки для продавців' });
            }

            const user = await this.updateSellerProfileUseCase.execute(id, req.body);

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' })
            }

            const response = UserResponseDTO.fromEntity(user);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Неавторизовано' });

            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            const avatarFile = files?.['image']?.[0];

            if (!avatarFile) {
                return res.status(400).json({ message: 'Файл не надано' });
            }

            const user = await this.uploadAvatarUseCase.execute(req.user.id, avatarFile.buffer);

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' })
            }

            const response = UserResponseDTO.fromEntity(user);
            
            res.status(200).json(response);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}