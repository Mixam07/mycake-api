import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const updateReviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional().messages({
        'number.base': 'Рейтинг має бути числом',
        'number.min': 'Мінімальна оцінка - 1 зірка',
        'number.max': 'Максимальна оцінка - 5 зірок'
    }),

    text: Joi.string().min(5).max(1000).optional().messages({
        'string.empty': 'Текст відгуку не може бути порожнім',
        'string.min': 'Відгук має містити хоча б 5 символів',
        'string.max': 'Відгук занадто довгий (макс. 1000 символів)'
    })
});

export const validateUpdateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error: bodyError } = updateReviewSchema.validate(req.body, { abortEarly: false });
    if (bodyError) {
        const errorMessages = bodyError.details.map(detail => detail.message);
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: errorMessages
        });
    }

    next();
};