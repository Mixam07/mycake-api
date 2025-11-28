import { Request, Response } from 'express';
import { CreatePastryUseCase } from '../../application/use-cases/create-pastry.use-case';3
import { PastryResponseDto } from '../dtos/pastry.dto';
import { GetPastriesUseCase } from '../../application/use-cases/get-pastries.use-case';
import { GetPastryByIdUseCase } from '../../application/use-cases/get-pastry-by-id.use-casse';
import { DeletePastryByIdUseCase } from '../../application/use-cases/delete-pastry-by-id.use-case';
import { UpdatePastryUseCase } from '../../application/use-cases/update-pastry.use-case';
import { UploadPastryPhotosUseCase } from '../../application/use-cases/upload-pastry-photos.use-case';

export class PastryController {
    constructor(
        private readonly createPastryUseCase: CreatePastryUseCase,
        private readonly getPastriesUseCase: GetPastriesUseCase,
        private readonly getPastryByIdUseCase: GetPastryByIdUseCase,
        private readonly updatePastryUseCase: UpdatePastryUseCase,
        private readonly uploadPastryPhotosUseCase: UploadPastryPhotosUseCase,
        private readonly deletePastryByIdUseCase: DeletePastryByIdUseCase
    ) {}

    async getPastries(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { pastries, total } = await this.getPastriesUseCase.execute(page, limit);
            
            res.status(200).json({
                data: PastryResponseDto.fromEntities(pastries),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPastryById(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const pastry = await this.getPastryByIdUseCase.execute(id);

            if (!pastry) {
                return res.status(404).json({ message: 'Десерт не знайдено' });
            }
            
            const response = PastryResponseDto.fromEntity(pastry)

            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async createPastry(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Неавторизовано' });

            const userId = req.user.id;

            const createdPastry = await this.createPastryUseCase.execute(req.body, userId);

            const fullPastry = await this.getPastryByIdUseCase.execute(createdPastry.id);

            if (!fullPastry) {
                return res.status(404).json({ message: 'Десерт не знайдено' });
            }

            const response = PastryResponseDto.fromEntity(fullPastry);

            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePastry(req: Request, res: Response) {
        try {
            if (!req.body) {
                return res.status(400).json({ message: 'Додайте якусь інформацію для зміни' })
            }
            
            const pastry = await this.updatePastryUseCase.execute(req.body, req.params.id);

            if (!pastry) {
                return res.status(404).json({ message: 'Десерт не знайдено' });
            }

            const response = PastryResponseDto.fromEntity(pastry);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async uploadPhotos(req: Request, res: Response) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            if (!files || Object.keys(files).length === 0) {
                return res.status(400).json({ message: 'Файли не знайдено' });
            }

            const images = files['images'] || [];

            const filesBuffers = images.map(file => file.buffer);

            const pastry = await this.uploadPastryPhotosUseCase.execute(req.params.id, filesBuffers);

            if (!pastry) {
                return res.status(404).json({ message: 'Десерт не знайдено' });
            }

            const response = PastryResponseDto.fromEntity(pastry);

            res.status(200).json(response)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }

    async deletePastryById(req: Request, res: Response) {
        try{
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Неавторизовано' });
            }

            const pastryId = req.params.id;

            const pastry = await this.deletePastryByIdUseCase.execute(pastryId, userId);

            if (!pastry) {
                return res.status(404).json({ message: 'Десерт не знайдено' });
            }

            const response = PastryResponseDto.fromEntity(pastry);

            res.status(200).json(response)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
}