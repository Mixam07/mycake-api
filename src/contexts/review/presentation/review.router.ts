import { Router } from 'express';

import { CreateReviewUseCase } from '../application/use-cases/create-review.use-case';
import { GetReviewsUseCase } from '../application/use-cases/get-reviews.use-case';
import { GetReviewByIdUseCase } from '../application/use-cases/get-review-by-id.use-case';
import { GetReviewsByConfectionerIdUseCase } from '../application/use-cases/get-reviews-by-confectioner-id.use-case';
import { GetReviewsByPastryIdUseCase } from '../application/use-cases/get-reviews-by-pastry-id.use-case';
import { UpdateReviewByIdUseCase } from '../application/use-cases/update-review-by-id.use-case';
import { DeleteReviewByIdUseCase } from '../application/use-cases/delete-review-by-id.use-case';

import { ReviewController } from './controllers/review.controller';

import { ReviewMongoRepository } from '../infrastructure/repositories/review.mongo-repository';

import { checkApiKey, checkAuthToken } from '../../../shared/infrastructure/http/auth.middleware';

import { PastryMongoRepository } from '../../pastry/infrastructure/repositories/pastry.mongo-repository';
import { validateCreateReview } from './middlewares/create-review.middleware';
import { validateUpdateReview } from './middlewares/update-category.middleware';

const router = Router();

const reviewRepository = new ReviewMongoRepository();
const pastryRepository = new PastryMongoRepository();

const createReviewUseCase = new CreateReviewUseCase(reviewRepository, pastryRepository);
const getReviewsUseCase = new GetReviewsUseCase(reviewRepository);
const getReviewByIdUseCase = new GetReviewByIdUseCase(reviewRepository);
const getReviewsByConfectionerIdUseCase = new GetReviewsByConfectionerIdUseCase(reviewRepository);
const getReviewsByPastryIdUseCase = new GetReviewsByPastryIdUseCase(reviewRepository);
const updateReviewByIdUseCase = new UpdateReviewByIdUseCase(reviewRepository);
const deleteReviewByIdUseCase = new DeleteReviewByIdUseCase(reviewRepository);

const reviewController = new ReviewController(
    createReviewUseCase, getReviewsUseCase, getReviewByIdUseCase, getReviewsByConfectionerIdUseCase,
    getReviewsByPastryIdUseCase, updateReviewByIdUseCase, deleteReviewByIdUseCase
);

router.post('/', checkAuthToken, validateCreateReview, (req, res) => reviewController.createReview(req, res));
router.get('/', checkApiKey, (req, res) => reviewController.getReviews(req, res));
router.get('/:id', checkApiKey, (req, res) => reviewController.getReviewById(req, res));
router.get('/confectioner/:id', checkAuthToken, (req, res) => reviewController. getReviewsByConfectionerId(req, res));
router.get('/pastry/:id', checkAuthToken, (req, res) => reviewController. getReviewsByPastryId(req, res));
router.patch('/:id', checkApiKey, validateUpdateReview, (req, res) => reviewController.updateReview(req, res));
router.delete('/:id', checkApiKey, (req, res) => reviewController.deleteReview(req, res));

export { router as reviewRouter };