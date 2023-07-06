import {ObjectId} from 'mongodb';
import {UserDbType} from '../../types/types';
import {UserViewModel} from '../../models/users/userViewModel';
import {usersCollection} from '../../db/db';


export const usersRepository = {
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

    async deleteUserById(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAllUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.acknowledged === true
    },
}

