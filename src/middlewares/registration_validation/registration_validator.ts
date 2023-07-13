import {body} from 'express-validator';

export const registrationEmailResendingCheck = body('email')
    .isString().withMessage('Should be string')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email')
