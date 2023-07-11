import {Router, Response, Request} from 'express';
import {loginOrEmail, password} from '../../middlewares/authorization_validation/auth_validation';
import {errorsValidation} from '../../middlewares/errors_reply/errors_validation';
import {RequestWithBody} from '../../types/types';
import {LoginInputModel} from '../../models/auth/loginInputModel';
import {usersService} from '../../domain/users/users_service';
import {jwtService} from '../../application/jwt_service';
import {authValidationBearer} from '../../middlewares/authorization_validation/auth_validation_bearer';
import {MeViewModel} from '../../models/auth/meViewModel';
import {UserInputModel} from '../../models/users/userInputModel';
import {emailValidation, loginValidation, passwordValidation
} from '../../middlewares/users_validation/users_validation';
import {RegistrationCofirmationCodeModel} from '../../models/registration/registrationCofirmationCode';
import {authService} from '../../domain/auth/auth_service';
import {usersRepository} from '../../repositories/users/users_repository';
import {usersQueryRepository} from '../../repositories/users/users_query_repository';



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

authRouter.post('/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    errorsValidation,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const existingUserByEmail = await usersService.getUserByEmail(req.body.email)
        if (existingUserByEmail) {
            res.sendStatus(400)
            return
        }
    const exisingUserByPassword = await usersService.getUserByPassword(req.body.password)
        if (exisingUserByPassword) {
            res.sendStatus(400)
            return
        }
    const createUserResult = await usersService.createUser(req.body)
        if (createUserResult) {
            res.sendStatus(204)
        }
})

// authRouter.post('/registration-confirmation', async (req: RequestWithBody<RegistrationCofirmationCodeModel>, res: Response) => {
//     //confirmUserMiddleware
//     const resultConfirmation = await authService.doOperation()
//     res.sendStatus(204)
// })

// authRouter.post('/registration-email-resending', async (req: Request, res: Response) => {
//     res.sendStatus(204)
// })

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
