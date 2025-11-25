import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const updateCategorySchema = Joi.object({
    name: Joi.string().min(3).max(50).messages({
        'string.base': 'Назва категорії має бути рядком',
        'string.empty': 'Назва категорії не може бути порожньою',
        'string.min': 'Назва категорії має містити не менше 3 символів',
        'string.max': 'Назва категорії занадто довга (макс. 50 символів)',
        'any.required': 'Назва категорії є обов’язковою'
    }),
});

export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateCategorySchema.validate(req.body, { abortEarly: false });

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