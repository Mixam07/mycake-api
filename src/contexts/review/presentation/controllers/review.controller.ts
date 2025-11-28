import { Request, Response } from "express";
import { CreateReviewUseCase } from "../../application/use-cases/create-review.use-case";
import { ReviewResponseDTO } from "../dtos/review.dto";
import { GetReviewByIdUseCase } from "../../application/use-cases/get-review-by-id.use-case";
import { GetReviewsUseCase } from "../../application/use-cases/get-reviews.use-case";
import { DeleteReviewByIdUseCase } from "../../application/use-cases/delete-review-by-id.use-case";
import { GetReviewsByConfectionerIdUseCase } from "../../application/use-cases/get-reviews-by-confectioner-id.use-case";
import { GetReviewsByPastryIdUseCase } from "../../application/use-cases/get-reviews-by-pastry-id.use-case";
import { UpdateReviewByIdUseCase } from "../../application/use-cases/update-review-by-id.use-case";


export class ReviewController {
    constructor(
        private readonly createReviewUseCase: CreateReviewUseCase,
        private readonly getReviewsUseCase: GetReviewsUseCase,
        private readonly getReviewByIdUseCase: GetReviewByIdUseCase,
        private readonly getReviewsByConfectionerIdUseCase: GetReviewsByConfectionerIdUseCase,
        private readonly getReviewsByPastryIdUseCase: GetReviewsByPastryIdUseCase,
        private readonly updateReviewByIdUseCase: UpdateReviewByIdUseCase,
        private readonly deleteReviewByIdUseCase: DeleteReviewByIdUseCase
    ) {}

    async createReview(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Неавторизовано' });

            const userId = req.user.id;

            const createdReview = await this.createReviewUseCase.execute({
                userId,
                ...req.body
            });

            const fullReview = await this.getReviewByIdUseCase.execute(createdReview.id);

            if (!fullReview) {
                return res.status(404).json({ message: 'Відгук не знайдено' })
            }

            const response = ReviewResponseDTO.fromEntity(fullReview);

            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReviews(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { reviews, total } = await this.getReviewsUseCase.execute(page, limit);
            
            res.status(200).json({
                data: ReviewResponseDTO.fromEntities(reviews),
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

    async getReviewById(req: Request, res: Response) {
        try {
            const review = await this.getReviewByIdUseCase.execute(req.params.id);

            if (!review) {
                return res.status(404).json({ message: 'Відгук не знайдено' })
            }

            const response = ReviewResponseDTO.fromEntity(review);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReviewsByConfectionerId(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const { reviews, total } = await this.getReviewsByConfectionerIdUseCase.execute(req.params.id, page, limit);
            
            res.status(200).json({
                data: ReviewResponseDTO.fromEntities(reviews),
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

    async getReviewsByPastryId(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const { reviews, total } = await this.getReviewsByPastryIdUseCase.execute(req.params.id, page, limit);
            
            res.status(200).json({
                data: ReviewResponseDTO.fromEntities(reviews),
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

    async updateReview(req: Request, res: Response) {
        try {
            if (!req.body) {
                return res.status(400).json({ message: 'Додайте якусь інформацію для зміни' })
            }

            const review = await this.updateReviewByIdUseCase.execute(req.params.id, req.body);

            if (!review) {
                return res.status(404).json({ message: 'Відгук не знайдено' })
            }

            const response = ReviewResponseDTO.fromEntity(review);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const review = await this.deleteReviewByIdUseCase.execute(req.params.id);

            if (!review) {
                return res.status(404).json({ message: 'Відгук не знайдено' })
            }

            const response = ReviewResponseDTO.fromEntity(review);

            res.status(200).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}