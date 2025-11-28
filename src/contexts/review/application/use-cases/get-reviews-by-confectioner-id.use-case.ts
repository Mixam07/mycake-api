import { IReviewRepository, PaginatedReviews } from "../../domain/repositories/i-review.repository";

export class GetReviewsByConfectionerIdUseCase {
    constructor(
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(confectionerId: string, page: number = 1, limit: number = 10): Promise<PaginatedReviews> {
        const safeLimit = limit > 100 ? 100 : limit;

        const reviews = await this.reviewRepository.findByConfectionerId(confectionerId, page, safeLimit);

        return reviews;
    }
}