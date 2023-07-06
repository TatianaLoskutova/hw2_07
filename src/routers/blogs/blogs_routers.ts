import {Router, Response} from 'express';
import {ObjectId} from 'mongodb';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery} from '../../types/types';
import {BlogQueryModel} from '../../models/blog/blogQueryModel';
import {blogQueryRepository} from '../../repositories/blogs/blogs_query_repository';
import {GetByIdParam} from '../../models/getById';
import {PostQueryModel} from '../../models/post/postQueryModel';
import {postsQueryRepository} from '../../repositories/posts/posts_query_repository';
import {blogDescriptionValidation, blogNameValidation,blogWebsiteUrlValidation} from '../../middlewares/blogs_validation/blogs_validators';
import {errorsValidation} from '../../middlewares/errors_reply/errors_validation';
import {BlogInputModel} from '../../models/blog/blogInputModel';
import {blogsService} from '../../domain/blogs/blogs_service';
import {postContentValidation, postShortDescription, postTitleValidation} from '../../middlewares/posts_validation/posts_validators';
import {PostInputModel} from '../../models/post/postInputModel';
import {postsService} from '../../domain/posts/posts_service';
import {authorizationValidationВasic} from '../../middlewares/authorization_validation/authorization_validation_basic';

export const blogsRouters = Router()

// ничего менять не нужно
blogsRouters.get('/', async (req: RequestWithQuery<BlogQueryModel>, res: Response) => {
    const allBlogs = await blogQueryRepository.getAllBlogs(
        req.query.searchNameTerm,
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize
    )
    if (allBlogs) {
        res.status(200).send(allBlogs)
    }
})

// менять не нужно
blogsRouters.get('/:id', async (req:RequestWithParams<GetByIdParam>, res: Response) => {
    const result = await blogQueryRepository.findBlogById(new ObjectId(req.params.id))
    if (!result) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(result)
})

// менять не нужно
blogsRouters.get('/:id/posts', async (req: RequestWithParamsAndQuery<GetByIdParam,PostQueryModel>, res: Response) => {
    const result = await blogQueryRepository.findBlogById(new ObjectId(req.params.id))
    if (!result) {
        res.sendStatus(404)
        return
    }
    const foundedPostByBlogId = await postsQueryRepository.getPostsByBlogId(
        new ObjectId(req.params.id),
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    res.status(200).send(foundedPostByBlogId)
})

// Менять не нужно
blogsRouters.post('/',
    authorizationValidationВasic,
    blogNameValidation,
    blogDescriptionValidation,
    blogWebsiteUrlValidation,
    errorsValidation,
    async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog = await blogsService.createBlog(req.body)
    if (newBlog) {
        res.status(201).send(newBlog)
    }
})

// Менять не нужно
blogsRouters.post('/:id/posts',
    authorizationValidationВasic,
    postTitleValidation,
    postShortDescription,
    postContentValidation,
    errorsValidation,
    async (req: RequestWithParamsAndBody<GetByIdParam, PostInputModel>, res: Response) => {
        const newPostForBlogById = await postsService.createPostForBlogById(new ObjectId(req.params.id), req.body)
        if (!newPostForBlogById) {
            res.sendStatus(404)
            return
        } else  {
            res.status(201).send(newPostForBlogById)
        }

    })

// менять не нужно
blogsRouters.put('/:id',
    authorizationValidationВasic,
    blogNameValidation,
    blogDescriptionValidation,
    blogWebsiteUrlValidation,
    errorsValidation,
    async (req: RequestWithParamsAndBody<GetByIdParam,BlogInputModel>, res: Response) => {
        const isUpdated = await blogsService.updateBlog(req.params.id, req.body)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

// менять не нужно
blogsRouters.delete('/:id',
    authorizationValidationВasic,
    async (req: RequestWithParams<GetByIdParam>, res: Response) => {
        const isDeleted = await blogsService.deleteBlogById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })
