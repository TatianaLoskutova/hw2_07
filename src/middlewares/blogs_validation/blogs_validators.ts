import {body} from 'express-validator';

export const blogNameValidation = body('name')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 1, max: 15}).withMessage('Incorrect length')
export const blogDescriptionValidation = body('description')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 1, max: 500}).withMessage('Incorrect length')
export const blogWebsiteUrlValidation = body('websiteUrl')
    .isString().withMessage('Should be string')
    .trim().isLength({min: 1, max: 100}).withMessage('Incorrect length')
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('Incorrect Url')