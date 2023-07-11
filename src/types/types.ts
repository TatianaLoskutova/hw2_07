import {ObjectId} from 'mongodb'
import {Request} from 'express';

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

export type UserAccountDbType = {
    _id: ObjectId
    accountData: {
        login: string
        email: string
        passwordHash: string
        passwordSalt: string
        createdAt: string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: number
        isConfirmed: boolean
    }
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

