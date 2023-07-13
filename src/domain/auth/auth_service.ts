import {emailManager} from '../../managers/email_manager';
import {UserInputModel} from '../../models/users/userInputModel';
import bcrypt, {compare} from 'bcrypt';
import {UserAccountDbType} from '../../types/types';
import {ObjectId} from 'mongodb';
import {usersRepository} from '../../repositories/users/users_repository';
import {LoginInputModel} from '../../models/auth/loginInputModel';
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'



export const authService = {
    async createUser(inputData: UserInputModel): Promise<UserAccountDbType | null> {
        const passwordHash = await this._generateHash(inputData.password)
        const user: UserAccountDbType = {
            _id: new ObjectId(),
            accountData: {
                login: inputData.login,
                email: inputData.email,
                passwordHash: passwordHash,
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

    async checkCredentials(inputData: LoginInputModel) {
        const user = await usersRepository.findByLoginOrEmail(inputData.loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) {
            return null
        }

        const isHashesEquals = await this._isPasswordCorrect(inputData.password, user.accountData.passwordHash)
        if (isHashesEquals) {
            return user
        } else {
            return null
        }
    },

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await usersRepository.updateConfirmation(user._id)
        return result
    },

    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }
    // async checkAndFindUserByEmail,

}