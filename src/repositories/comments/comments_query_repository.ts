import {commentsCollection, postsCollection} from '../../db/db';
import {makeCommentMapping, makeCommentsPagination} from '../../helpers/functions';
import {PaginatorCommentViewModel} from '../../models/comment/commentsViewModelWithPagination';
import {ObjectId} from 'mongodb';
import {PostViewModel} from '../../models/post/postViewModel';
import {CommentViewModel} from '../../models/comment/commentViewModel';
import {CommentatorInfo} from '../../models/comment/commentatorInfo';


export const commentsQueryRepository = {
    async getAllCommentsForPost(
        postId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc'
    ): Promise<PaginatorCommentViewModel> {

        const filter: any = {postId: postId}
        const sortObj: any = {}


        if (sortBy) {
            sortObj[sortBy] = -1
        }

        if (sortDirection === 'asc') {
            sortObj[sortBy] = 1
        }
        const commentsCount = await commentsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(commentsCount / +pageSize)
        const paging = await makeCommentsPagination(sortObj, pageNumber, pageSize,filter)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: commentsCount,
            items: makeCommentMapping(paging)
        }
    },

    async findCommentById(_id: ObjectId): Promise<CommentViewModel | null> {
        const foundedComment = await commentsCollection.findOne({_id})
        if (!foundedComment) {
            return null
        }
        return {
            id: foundedComment._id.toString(),
            content: foundedComment.content,
            commentatorInfo: {
                userId: foundedComment.commentatorInfo.userId,
                userLogin: foundedComment.commentatorInfo.userLogin
            },
            createdAt: foundedComment.createdAt
        }
    },
}