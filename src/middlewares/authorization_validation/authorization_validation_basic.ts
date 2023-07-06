import {NextFunction, Request, Response} from 'express';
import base64 from 'js-base64'

export const authorizationValidationВasic = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Basic')) {
        res.status(401).send('Authorization header is incorrect')
        return
    }

    const loginPass = authHeader.replace('Basic', '')
    const [login, password] = base64.decode(loginPass).split(':')

    if (login !== 'admin' || password !== 'qwerty') {
        res.status(401).send('Invalid login or password')
        return;
    }
    next()
}