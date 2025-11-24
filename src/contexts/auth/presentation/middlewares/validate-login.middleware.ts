import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const loginSchema = Joi.object({
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
    })
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });

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