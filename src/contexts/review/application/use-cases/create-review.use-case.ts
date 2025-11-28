import { Types } from 'mongoose';
import { CreateReviewDto } from '../../presentation/dtos/review.dto';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/i-review.repository';
import { IPastryRepository } from '../../../pastry/domain/repositories/i-pastry.repository';

export class CreateReviewUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
        private readonly pastryRepository: IPastryRepository
    ) {}

    async execute(dto: CreateReviewDto): Promise<Review> {
        const pastry = await this.pastryRepository.findById(dto.pastryId);

        if (!pastry) {
            throw new Error('Десерт не знайдено');
        }

        if (dto.userId === pastry.confectionerId) {
            throw new Error('Ви не можете залишити відгук самому собі')
        }

        const reviewId = new Types.ObjectId().toString();

        
        const review = new Review(
            reviewId,
            dto.text,
            dto.rating,
            dto.userId,
            pastry.id,
            pastry.confectionerId,
            null,
            null,
            null,
        )

        await this.reviewRepository.save(review);

        return review
    }
}