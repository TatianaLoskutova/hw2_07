import {Router, Response, Request} from 'express';
import {loginOrEmail, password} from '../../middlewares/authorization_validation/auth_validation';
import {errorsValidation} from '../../middlewares/errors_reply/errors_validation';
import {RequestWithBody} from '../../types/types';
import {LoginInputModel} from '../../models/auth/loginInputModel';
import {usersService} from '../../domain/users/users_service';
import {jwtService} from '../../application/jwt_service';
import {authValidationBearer} from '../../middlewares/authorization_validation/auth_validation_bearer';
import {MeViewModel} from '../../models/auth/meViewModel';



export const authRouter = Router()

authRouter.post('/login',
    loginOrEmail,
    password,
    errorsValidation,
    async (req:RequestWithBody<LoginInputModel>, res: Response) => {
    const user = await usersService.checkCredentials(req.body)
        if (!user) {
            res.sendStatus(401)
            return
        }
        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
})


authRouter.get('/me',
    authValidationBearer,
    async (req: Request, res: Response) => {

    const currentUser: MeViewModel = {
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        };
        res.status(200).send(currentUser);
    }
)
