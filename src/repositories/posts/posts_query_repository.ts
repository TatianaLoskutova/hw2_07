import {ObjectId} from 'mongodb';
import {PaginatorPostViewModel} from '../../models/post/postViewModelWithPagination';
import {postsCollection} from '../../db/db';
import {makePostMapping, makePostPagination} from '../../helpers/functions';
import {PostViewModel} from '../../models/post/postViewModel';



export const postsQueryRepository = {
    async getAllPosts(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc'
    ): Promise<PaginatorPostViewModel> {
        const sortObj: any = {}

        if (sortBy) {
            sortObj[sortBy] = -1
        }

        if (sortDirection === 'asc') {
            sortObj[sortBy] = 1
        }
        const postsCount = await postsCollection.countDocuments()
        const pagesCount = Math.ceil(postsCount / +pageSize)
        const paging = await makePostPagination(sortObj, pageNumber, pageSize)


        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: makePostMapping(paging)
        }
    },

    async getPostsByBlogId(
        blogId: ObjectId,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc'
    ): Promise<PaginatorPostViewModel> {

        const filter = {blogId: blogId.toString()}
        const sortObj: any = {}

        if (sortBy) {
            sortObj[sortBy] = -1
        }
        if (sortDirection === 'asc') {
            sortObj[sortBy] = 1
        }

        const postsCount = await postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(postsCount / +pageSize)
        const paging = await makePostPagination(sortObj, pageNumber, pageSize, filter)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: postsCount,
            items: makePostMapping(paging)
        }
    },

    async findPostById(_id: ObjectId): Promise<PostViewModel | null> {
        const foundedPost = await postsCollection.findOne({_id})
        if (!foundedPost) {
            return null
        }
        return {
            id: foundedPost._id.toString(),
            title: foundedPost.title,
            shortDescription: foundedPost.shortDescription,
            content: foundedPost.content,
            blogId: foundedPost.blogId,
            blogName: foundedPost.blogName,
            createdAt: foundedPost.createdAt
        }
    },

}