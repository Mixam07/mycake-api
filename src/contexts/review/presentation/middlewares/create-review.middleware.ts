import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createReviewSchema = Joi.object({
    pastryId: Joi.string().length(24).hex().required().messages({
        'string.length': 'ID десерту має бути валідним ObjectId (24 символи)',
        'string.hex': 'ID десерту має містити тільки шістнадцяткові символи',
        'any.required': 'ID десерту (pastryId) є обов’язковим'
    }),

    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'Рейтинг має бути числом',
        'number.min': 'Мінімальна оцінка - 1 зірка',
        'number.max': 'Максимальна оцінка - 5 зірок',
        'any.required': 'Рейтинг (rating) є обов’язковим'
    }),

    text: Joi.string().min(5).max(1000).required().messages({
        'string.empty': 'Текст відгуку не може бути порожнім',
        'string.min': 'Відгук має містити хоча б 5 символів',
        'string.max': 'Відгук занадто довгий (макс. 1000 символів)',
        'any.required': 'Текст відгуку (text) є обов’язковим'
    })
});

export const validateCreateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createReviewSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: errorMessages
        });
    }

    next();
};