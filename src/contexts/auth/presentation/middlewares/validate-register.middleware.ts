import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.base': 'Ім’я має бути рядком',
        'string.empty': 'Ім’я не може бути порожнім',
        'string.min': 'Ім’я має містити не менше 2 символів',
        'string.max': 'Ім’я занадто довге',
        'any.required': 'Ім’я є обов’язковим полем'
    }),

    email: Joi.string().email().required().messages({
        'string.base': 'Email має бути рядком',
        'string.email': 'Введіть коректну Email адресу',
        'string.empty': 'Email не може бути порожнім',
        'any.required': 'Email є обов’язковим полем'
    }),

    password: Joi.string().min(6).required().messages({
        'string.base': 'Пароль має бути рядком',
        'string.empty': 'Пароль не може бути порожнім',
        'string.min': 'Пароль має містити не менше 6 символів',
        'any.required': 'Пароль є обов’язковим полем'
    }),

    role: Joi.string().valid('Buyer', 'Seller').required().messages({
        'any.only': 'Роль може бути лише Buyer або Seller',
        'any.required': 'Роль є обов’язковою'
    })
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

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