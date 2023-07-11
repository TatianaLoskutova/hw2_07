import {emailManager} from '../../managers/email_manager';
import {UserInputModel} from '../../models/users/userInputModel';
import {UserViewModel} from '../../models/users/userViewModel';
import bcrypt from 'bcrypt';
import {UserAccountDbType} from '../../types/types';
import {ObjectId} from 'mongodb';
import {usersRepository} from '../../repositories/users/users_repository';
import {LoginInputModel} from '../../models/auth/loginInputModel';
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'


export const authService = {
    async createUser(inputData: UserInputModel): Promise<UserAccountDbType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(inputData.password, passwordSalt)
        const user: UserAccountDbType = {
            _id: new ObjectId(),
            accountData: {
                login: inputData.login,
                email: inputData.email,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                    hours: 72,
                    minutes: 55
                }),
                isConfirmed: false
            }
        }
        const createResult = usersRepository.saveUserToDb(user)
        try {
            await emailManager.sendEmailConfirmationMessage(user)
        } catch (error) {
            // await usersRepository.deleteUserById(user._id.toString())
            return null
        }
        return createResult
    },


    // async doOperation() {
    //     // save to repo
    //     // get user from repo
    //     await emailManager.sendEmailRecoveryMessage({})
    // }

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(inputData: LoginInputModel) {
        const user = await usersRepository.findByLoginOrEmail(inputData.loginOrEmail)
        if (!user) return null
        const passwordHash = await this._generateHash(inputData.password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return null
        }
        return user
    },
    // async _isPasswordCorrect,
    // async checkAndFindUserByEmail,
    // async confirmEmail
}