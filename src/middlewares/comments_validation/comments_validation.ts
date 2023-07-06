import {body} from 'express-validator';

export const contentValidation = body('content')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 20, max: 300}).withMessage('Incorrect length')
