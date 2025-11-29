import { IReviewRepository, PaginatedReviews } from "../../domain/repositories/i-review.repository";

export class GetReviewsBySellerIdUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(sellerId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const safeLimit = limit > 100 ? 100 : limit;

        const reviews = await this.reviewRepository.findBySellerId(sellerId, page, safeLimit);

        return reviews;
    }
}