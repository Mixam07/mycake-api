import { Types } from 'mongoose';
import { CreateReviewDto } from '../../presentation/dtos/review.dto';
import { Review } from '../../domain/entities/review.entity';
import { IReviewRepository } from '../../domain/repositories/i-review.repository';
import { IPastryRepository } from '../../../pastry/domain/repositories/i-pastry.repository';
import { IUserRepository } from '../../../user/domain/repositories/i-user.repository';

export class CreateReviewUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
        private readonly pastryRepository: IPastryRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: CreateReviewDto): Promise<Review> {
        const pastry = await this.pastryRepository.findById(dto.pastryId);
        
        if (!pastry) {
            throw new Error('Десерт не знайдено');
        }

        const seller = await this.userRepository.findById(pastry.sellerId);
        
        if (!seller) {
            throw new Error('Користувача не знайдено');
        }

        if (dto.userId === seller.id) {
            throw new Error('Ви не можете залишити відгук самому собі')
        }

        const reviewId = new Types.ObjectId().toString();

        const review = new Review(
            reviewId,
            dto.text,
            dto.rating,
            dto.userId,
            pastry.id,
            pastry.sellerId,
        );

        pastry.addReviewId(reviewId);
        seller.addReviewId(reviewId);

        await this.pastryRepository.save(pastry);
        await this.reviewRepository.save(review);
        await this.userRepository.save(seller);

        return review
    }
}