import jwt, { sign } from 'jsonwebtoken';
import {setting} from '../settings';
import {LoginSuccessViewModel} from '../models/auth/loginSuccessViewModel';
import {UserDbType} from '../types/types';
import {ObjectId} from 'mongodb';

export const jwtService = {
    async createJWT(user: UserDbType): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userId: user._id}, setting.JWT_SECRET, {expiresIn: '500h'})
        return {
            accessToken: token
            }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, setting.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}