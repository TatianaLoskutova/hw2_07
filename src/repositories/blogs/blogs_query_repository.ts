import {ObjectId} from 'mongodb';
import {PaginatorBlogViewModel} from '../../models/blog/blogViewModelWithPagination';
import {blogsCollection} from '../../db/db';
import {makeBlogMapping, makeBlogPagination} from '../../helpers/functions';
import {BlogViewModel} from '../../models/blog/blogViewModel';


export const blogQueryRepository = {
    async getAllBlogs(
        searchNameTerm: string | null = null,
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc',
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<PaginatorBlogViewModel> {

        const filter: any = {}
        const sortObj: any = {}

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }
        if (sortBy) {
            sortObj[sortBy] = -1
        }
        if (sortDirection === 'asc') {
            sortObj[sortBy] = 1
        }
        const blogsCount = await blogsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(blogsCount / +pageSize)
        const paging = await makeBlogPagination(filter, sortObj, pageNumber, pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: blogsCount,
            items: makeBlogMapping(paging)
        }
    },

    async findBlogById(_id: ObjectId): Promise<BlogViewModel | null>  {
        const foundedBlog = await blogsCollection.findOne({_id})

        if (!foundedBlog) {
            return null
        }
        return {
            id: foundedBlog._id.toString(),
            name: foundedBlog.name,
            description: foundedBlog.description,
            websiteUrl: foundedBlog.websiteUrl,
            createdAt: foundedBlog.createdAt,
            isMembership: foundedBlog.isMembership
        }
    }



}