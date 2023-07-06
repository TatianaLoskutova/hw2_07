import {body} from 'express-validator';


export const loginValidation = body('login')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 3, max: 10}).withMessage('Incorrect length')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login')
export const passwordValidation = body('password')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 6, max: 20}).withMessage('Incorrect length')
export const emailValidation = body('email')
    .isString().withMessage('Should be string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email')

