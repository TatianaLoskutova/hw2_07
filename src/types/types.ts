import {ObjectId} from 'mongodb'
import {Request} from 'express';
import {WithId} from 'mongodb';

export type BlogMongoDbType = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostMongoDbType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type UserDbType = {
    _id: ObjectId
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: string
}

export type UserAccountDbType = WithId<{
    // _id: ObjectId
    accountData: UserAccountType
    emailConfirmation: EmailConfirmationType
}>

export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
    // sentEmail: SentEmailType[]
}
export type UserAccountType = {
    login: string
    email: string
    passwordHash: string
    // passwordSalt: string // salt под вопросом, смотря где
    createdAt: string
}
// надо ли для ДЗ хер пойми
export type RegistrationDataType = {
    ip: string
}
export type SentEmailType = {
    sentDate: string
}

export type CommentDbType = {
    _id: ObjectId
    postId:string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}


export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParamsAndQuery<T, B> = Request<T,{},{},B>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

