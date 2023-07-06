import {ObjectId} from 'mongodb';
import {BlogInputModel} from '../../models/blog/blogInputModel';
import {BlogViewModel} from '../../models/blog/blogViewModel';
import {BlogMongoDbType} from '../../types/types';
import {blogsRepository} from '../../repositories/blogs/blogs_repository';
import {blogQueryRepository} from '../../repositories/blogs/blogs_query_repository';



export const blogsService = {
    async createBlog(inputData: BlogInputModel): Promise<BlogViewModel> {
        const blogToMongoDb: BlogMongoDbType = {
            _id: new ObjectId(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.addBlogToMongoDb(blogToMongoDb)
    },

    async updateBlog(id: string, data: BlogInputModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return  await blogsRepository.updateBlog(id, data)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const blogToDelete = await blogQueryRepository.findBlogById(new ObjectId(id))

        if (!blogToDelete) {
            return false
        }
        return await blogsRepository.deleteBlogById(id)
    },

    async deleteAllBlogs(): Promise<boolean> {
        return  await blogsRepository.deleteAllBlogs()
    }


}