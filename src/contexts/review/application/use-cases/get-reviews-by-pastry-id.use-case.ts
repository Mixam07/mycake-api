import { IReviewRepository, PaginatedReviews } from "../../domain/repositories/i-review.repository";

export class GetReviewsByPastryIdUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(pastryId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const safeLimit = limit > 100 ? 100 : limit;

        const reviews = await this.reviewRepository.findByPastryId(pastryId, page, safeLimit);

        return reviews;
    }
}