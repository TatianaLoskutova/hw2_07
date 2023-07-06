import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../../application/jwt_service';
import {usersQueryRepository} from '../../repositories/users/users_query_repository';

export const authValidationBearer = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        res.sendStatus(401)
        return
    }

    const user = await usersQueryRepository.findUserById(userId)
    if (!user) {
        res.sendStatus(401)
        return
    }

    req.user = user
    next()
}