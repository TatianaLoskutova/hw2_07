import {ObjectId} from 'mongodb';
import {UserAccountDbType, UserDbType} from '../../types/types';
import {UserViewModel} from '../../models/users/userViewModel';
import {usersAccountsCollection, usersCollection} from '../../db/db';


export const usersRepository = {
    async saveUserToDb(user: UserAccountDbType){
        const result = await usersAccountsCollection.insertOne(user)
        return user
    },
    async addUserToDb(addedUser: UserDbType): Promise<UserViewModel> {
        const result = await usersCollection.insertOne(addedUser)
        return {
            id: result.insertedId.toString(),
            login: addedUser.login,
            email: addedUser.email,
            createdAt: addedUser.createdAt
        }
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({ $or: [ { email: loginOrEmail }, { login: loginOrEmail } ] })
        return user
    },

    async getUserByPasswordFromDb(password: string): Promise<UserDbType | null> {
        const user = await usersCollection.findOne({ passwordHash: password });
        if (!user) {
            return null
        }
        return user
    },

    async deleteUserById(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAllUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.acknowledged === true
    },
}

