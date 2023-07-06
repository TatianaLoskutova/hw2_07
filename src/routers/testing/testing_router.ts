import {Router, Request, Response} from 'express';
import {blogsService} from '../../domain/blogs/blogs_service';
import {postsService} from '../../domain/posts/posts_service';
import {usersService} from '../../domain/users/users_service';


export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await usersService.deleteAllUsers()
    res.sendStatus(204)
})