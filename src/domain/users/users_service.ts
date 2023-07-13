import bcrypt from 'bcrypt'
import {ObjectId} from 'mongodb';
import {UserInputModel} from '../../models/users/userInputModel';
import {UserViewModel} from '../../models/users/userViewModel';
import {UserDbType} from '../../types/types';
import {usersRepository} from '../../repositories/users/users_repository';
import {usersQueryRepository} from '../../repositories/users/users_query_repository';
import {LoginInputModel} from '../../models/auth/loginInputModel';



export const usersService = {
    async createUser(inputData: UserInputModel): Promise<UserViewModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(inputData.password, passwordSalt)

        const newUserDbType: UserDbType = {
            _id: new ObjectId(),
            login: inputData.login,
            email: inputData.email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.addUserToDb(newUserDbType)
    },

    async deleteUserById(id: string): Promise<boolean> {
        const userToDelete = await usersQueryRepository.findUserById(new ObjectId(id))

        if (!userToDelete) {
            return false
        }
        return await usersRepository.deleteUserById(id)
    },

    // async checkCredentials(inputData: LoginInputModel) {
    //     const user = await usersRepository.findByLoginOrEmail(inputData.loginOrEmail)
    //     if (!user) return null
    //     const passwordHash = await this._generateHash(inputData.password, user.passwordSalt)
    //     if (user.passwordHash !== passwordHash) {
    //         return null
    //     }
    //     return user
    // },

    async getUserByPassword(password: string): Promise<UserViewModel | null> {
        const user = await usersRepository.getUserByPasswordFromDb(password)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt);

        if (passwordHash) {
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            };
        }
        return null;
    },


    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteAllUsers(): Promise<boolean> {
        return  await usersRepository.deleteAllUsers()
    },

    async getUserByEmail(email: string): Promise<UserViewModel | null> {
        const getUserByEmail = await usersQueryRepository.getUserByEmailFromDb(email);
        if (getUserByEmail) {
            return getUserByEmail
        }
        return null
    },

}

