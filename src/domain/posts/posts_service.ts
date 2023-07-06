import {ObjectId} from 'mongodb';
import {PostInputModel} from '../../models/post/postInputModel';
import {PostViewModel} from '../../models/post/postViewModel';
import {blogQueryRepository} from '../../repositories/blogs/blogs_query_repository';
import {PostMongoDbType} from '../../types/types';
import {postsRepository} from '../../repositories/posts/posts_repository';
import {postsCollection} from '../../db/db';
import {CommentInputModel} from '../../models/comment/commentInputModel';
import {CommentViewModel} from '../../models/comment/commentViewModel';


export const postsService = {
    async createPostForBlogById(_id: ObjectId, inputData: PostInputModel): Promise<PostViewModel | undefined> {
        const result = await blogQueryRepository.findBlogById(_id)
        if (!result) {
            return undefined
        }
        const postToMongoDb: PostMongoDbType = {
            _id: new ObjectId(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: result.id,
            blogName: result.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(postToMongoDb)
    },

    async createPost(inputData: PostInputModel): Promise<PostViewModel | null> {
        const result = await blogQueryRepository.findBlogById(new ObjectId(inputData.blogId))
        if (!result) {
            return null
        }
        const postToMongoDb: PostMongoDbType = {
            _id: new ObjectId(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: result.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(postToMongoDb)
    },


    async updatePost(id: string, data: PostInputModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await postsRepository.updatePost(id, data)
    },

    async deletePostById(id: string): Promise<boolean> {
        const postToDelete = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!postToDelete) {
            return false
        }
        return await postsRepository.deletePostById(id)
    },

    async deleteAllPosts(): Promise<boolean> {
        return await postsRepository.deleteAllPosts()
    }
}