import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const updateProfileSchema = Joi.object({
    phone: Joi.string().pattern(/^\+?[0-9\s-]{10,20}$/).allow('').optional().messages({
        'string.pattern.base': 'Телефон має бути у форматі +380XXXXXXXXX'
    }),

    description: Joi.string().max(1000).allow('').optional().messages({
        'string.max': 'Опис занадто довгий (макс. 1000 символів)'
    }),
    
    address: Joi.string().max(200).allow('').optional().messages({
        'string.max': 'Адреса занадто довга'
    }),

    deliveryInfo: Joi.string().max(500).allow('').optional(),
    
    paymentInfo: Joi.string().max(500).allow('').optional(),

    socialMedia: Joi.object({
        instagram: Joi.string().uri().allow('').optional().messages({
            'string.uri': 'Instagram має бути посиланням (https://...)'
        }),
        facebook: Joi.string().uri().allow('').optional().messages({
            'string.uri': 'Facebook має бути посиланням (https://...)'
        }),
        youtube: Joi.string().uri().allow('').optional().messages({
            'string.uri': 'YouTube має бути посиланням (https://...)'
        })
    }).optional()
});

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateProfileSchema.validate(req.body, { abortEarly: false });

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