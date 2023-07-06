import {body} from 'express-validator';


export const loginOrEmail = body('loginOrEmail')
    .isString().withMessage('Should be string')
export const password = body('password')
    .isString().withMessage('Should be string')