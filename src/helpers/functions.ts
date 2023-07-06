import {blogsCollection, commentsCollection, postsCollection, usersCollection} from '../db/db';
import {BlogMongoDbType, CommentDbType, PostMongoDbType, UserDbType} from '../types/types';
import {CommentViewModel} from '../models/comment/commentViewModel';


export const makeBlogPagination = async (
    filter: any,
    sortObj: any,
    pageNumber: number,
    pageSize: number
) => {
    return await blogsCollection
        .find(filter)
        .sort(sortObj)
        .skip(+pageNumber > 0 ? (+pageNumber - 1) * +pageSize: 0)
        .limit(+pageSize > 0 ? +pageSize : 0)
        .toArray()
}

export const makeBlogMapping = (arr: BlogMongoDbType[]) => {
    return arr.map((blog) => {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    })
}

export const makePostPagination = async (
    sortObj: any,
    pageNumber: number,
    pageSize: number,
    filter?: any
) => {
    return await postsCollection
        .find(filter)
        .sort(sortObj)
        .skip(+pageNumber > 0 ? (+pageNumber - 1) * +pageSize : 0)
        .limit(+pageSize > 0 ? +pageSize : 0)
        .toArray()
}

export const makePostMapping  = (arr: PostMongoDbType[]) => {
    return arr.map((post) => {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    })
}


export const makeCommentsPagination = async (
    sortObj: any,
    pageNumber: number,
    pageSize: number,
    filter?: any
) => {
    return await commentsCollection
        .find(filter)
        .sort(sortObj)
        .skip(+pageNumber > 0 ? (+pageNumber - 1) * +pageSize : 0)
        .limit(+pageSize > 0 ? +pageSize : 0)
        .toArray()
}

export const makeCommentMapping  = (arr: CommentDbType[]) => {
    return arr.map((comment) => {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    })
}

export const makeUserPagination = async (
    filter: any,
    sortObj: any,
    pageNumber: number,
    pageSize: number
) => {
    return await usersCollection
        .find(filter)
        .sort(sortObj)
        .skip(+pageNumber > 0 ? (+pageNumber - 1) * +pageSize: 0)
        .limit(+pageSize > 0 ? +pageSize : 0)
        .toArray()
}

export const makeUserMapping = (arr: UserDbType[]) => {
    return arr.map((user) => {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt

        }
    })
}



