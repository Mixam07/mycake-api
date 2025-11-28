import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createPastrySchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'Назва має бути рядком',
        'string.empty': 'Назва не може бути порожньою',
        'string.min': 'Назва має бути довшою за 3 символи',
        'string.max': 'Назва занадто довга (макс. 100 символів)',
        'any.required': 'Назва (name) є обов’язковою'
    }),

    categoryId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Некоректний формат ID категорії (має бути 24 символи hex)',
            'string.empty': 'Виберіть категорію',
            'any.required': 'Категорія (categoryId) є обов’язковою'
        }),

    status: Joi.string().valid('active', 'draft', 'hidden').default('active').messages({
        'any.only': 'Статус може бути лише: active, draft або hidden'
    }),

    price: Joi.number().positive().required().messages({
        'number.base': 'Ціна має бути числом',
        'number.positive': 'Ціна не може бути від’ємною або нульовою',
        'any.required': 'Ціна (price) є обов’язкова'
    }),

    description: Joi.string().required().messages({
        'string.empty': 'Опис не може бути порожнім',
        'any.required': 'Опис товару (description) є обов’язковим'
    }),

    weight: Joi.number().positive().required().messages({
        'number.base': 'Вага має бути числом',
        'number.positive': 'Вага має бути додатною',
        'any.required': 'Вага (weight) є обов’язкова'
    }),

    minWeight: Joi.number().positive().required().messages({
        'number.base': 'Мінімальна вага має бути числом',
        'number.positive': 'Мінімальна вага має бути більше 0',
        'any.required': 'Мінімальна вага (minWeight) є обов’язкова'
    }),

    maxWeight: Joi.number().positive().greater(Joi.ref('minWeight')).required().messages({
        'number.base': 'Максимальна вага має бути числом',
        'number.positive': 'Максимальна вага має бути більше 0',
        'number.greater': 'Максимальна вага повинна бути більшою за мінімальну',
        'any.required': 'Максимальна вага (maxWeight) є обов’язкова'
    }),

    tags: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Теги мають бути масивом рядків'
    }),

    fillings: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Начинки мають бути масивом рядків'
    }),

    additionalServices: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Додаткові послуги мають бути масивом рядків'
    })
});

export const validateCreatePastry = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createPastrySchema.validate(req.body, { abortEarly: false });

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