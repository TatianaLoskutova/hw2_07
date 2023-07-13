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
import {RegistrationConfirmationCodeModel} from '../../models/registration/registrationCofirmationCode';
import {authService} from '../../domain/auth/auth_service';
import {RegistrationEmailResending} from '../../models/registration/registrationEmailResending';
import {registrationEmailResendingCheck} from '../../middlewares/registration_validation/registration_validator';




export const authRouter = Router()

authRouter.post('/login',
    loginOrEmail,
    password,
    errorsValidation,
    async (req:RequestWithBody<LoginInputModel>, res: Response) => {
    const user = await authService.checkCredentials(req.body)
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
    const createUserResult = await authService.createUser(req.body)
        if (createUserResult) {
            res.sendStatus(204)
        }
})

authRouter.post('/registration-confirmation',
    loginValidation,
    passwordValidation,
    emailValidation,
    errorsValidation,
    async (req: RequestWithBody<RegistrationConfirmationCodeModel>, res: Response) => {
    //confirmUserMiddleware
    const resultConfirmation = await authService.confirmEmail(req.body.code)
    if (resultConfirmation) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }

})

authRouter.post('/registration-email-resending',
    registrationEmailResendingCheck,
    errorsValidation,
    async (req: RequestWithBody<RegistrationEmailResending>, res: Response) => {
    const result = await  authService.confirmEmail(req.body.email)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }

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
