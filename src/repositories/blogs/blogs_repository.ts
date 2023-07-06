import {ObjectId} from 'mongodb';
import {BlogMongoDbType} from '../../types/types';
import {BlogViewModel} from '../../models/blog/blogViewModel';
import {blogsCollection} from '../../db/db';
import {BlogInputModel} from '../../models/blog/blogInputModel';


export const blogsRepository = {
    async addBlogToMongoDb(addedBlog: BlogMongoDbType): Promise<BlogViewModel> {
        const result = await blogsCollection.insertOne(addedBlog)
        return {
            id: result.insertedId.toString(),
            name: addedBlog.name,
            description: addedBlog.description,
            websiteUrl: addedBlog.websiteUrl,
            createdAt: addedBlog.createdAt,
            isMembership: addedBlog.isMembership
        }
    },

    async updateBlog(id: string, data: BlogInputModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const _id = new ObjectId(id)
        const result = await blogsCollection.updateOne({_id: _id},{
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean>{
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },


    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.acknowledged === true
    },




}