import {Router,Response} from 'express';
import {RequestWithBody, RequestWithParams, RequestWithQuery} from '../../types/types';
import {UserQueryModel} from '../../models/users/userQueryModel';
import {usersQueryRepository} from '../../repositories/users/users_query_repository';
import {emailValidation, loginValidation, passwordValidation} from '../../middlewares/users_validation/users_validation';
import {authorizationValidationВasic} from '../../middlewares/authorization_validation/authorization_validation_basic';
import {errorsValidation} from '../../middlewares/errors_reply/errors_validation';
import {UserInputModel} from '../../models/users/userInputModel';
import {usersService} from '../../domain/users/users_service';
import {GetByIdParam} from '../../models/getById';


export const usersRouter = Router()

// менять не нужно
usersRouter.get('/', async (req: RequestWithQuery<UserQueryModel>, res: Response) => {
    const allUsers = await usersQueryRepository.getAllUsers(
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.searchLoginTerm,
        req.query.searchEmailTerm
    )
    if (!allUsers) {
        res.sendStatus(401)
        return
    } else {
        res.status(200).send(allUsers)
    }
})

// менять не нужно
usersRouter.post('/',
    loginValidation,
    passwordValidation,
    emailValidation,
    authorizationValidationВasic,
    errorsValidation,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const newUser = await usersService.createUser(req.body)
    if(!newUser) {
        res.sendStatus(401)
    } else {
        res.status(201).send(newUser)
    }
})

// менять не нужно
usersRouter.delete('/:id',
    authorizationValidationВasic,
    errorsValidation,
    async (req: RequestWithParams<GetByIdParam>, res: Response) => {
        const isDeleted = await usersService.deleteUserById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })
