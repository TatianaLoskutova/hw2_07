import {CommentInputModel} from '../../models/comment/commentInputModel';
import {CommentViewModel} from '../../models/comment/commentViewModel';
import {ObjectId} from 'mongodb';
import {commentsRepository} from '../../repositories/comments/comments_repository';
import {CommentDbType} from '../../types/types';
import {UserViewModel} from '../../models/users/userViewModel';
import {commentsCollection} from '../../db/db';





export const commentsService = {
    async createComment(inputData: CommentInputModel, user: UserViewModel, postId: string): Promise<CommentViewModel | null> {
        const commentToMongoDb: CommentDbType = {
            _id: new ObjectId(),
            postId: postId.toString(),
            content: inputData.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
        }
        return await commentsRepository.createComment(commentToMongoDb)
    },

    async updateComment(commentId: string, data: CommentInputModel): Promise<boolean> {
        if (!ObjectId.isValid(commentId)) {
            return false
        }
        return await commentsRepository.updateComment(commentId, data)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const commentToDelete = await commentsCollection.findOne({_id: new ObjectId(id)})

        if (!commentToDelete) {
            return false
        }
        return await commentsRepository.deleteCommentById(id)
    },
}

