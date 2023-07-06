import {CommentDbType} from '../../types/types';
import {commentsCollection, postsCollection} from '../../db/db';
import {CommentViewModel} from '../../models/comment/commentViewModel';
import {PostInputModel} from '../../models/post/postInputModel';
import {ObjectId} from 'mongodb';
import {CommentInputModel} from '../../models/comment/commentInputModel';


export const commentsRepository = {
    async createComment(newComment: CommentDbType): Promise<CommentViewModel> {

        const result = await commentsCollection.insertOne(newComment)
        return {
            id: result.insertedId.toString(),
            content: newComment.content,
            commentatorInfo: {
                userId: newComment.commentatorInfo.userId,
                userLogin: newComment.commentatorInfo.userLogin
            },
            createdAt: newComment.createdAt
        }
    },

    async updateComment(id: string, data: CommentInputModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const result = await commentsCollection.updateOne({_id: _id},{
            $set: {
                content: data.content
            }
        })
        return result.matchedCount === 1
    },

    async deleteCommentById(id: string): Promise<boolean>{
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
}