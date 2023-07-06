import express from 'express'
import bodyParser from 'body-parser'
import {blogsRouters} from './routers/blogs/blogs_routers';
import {postsRouters} from './routers/posts/posts_routers';
import {testingRouter} from './routers/testing/testing_router';
import {authRouter} from './routers/auth/auth_router';
import {usersRouter} from './routers/users/users_router';
import {commentsRouter} from './routers/comments/comments_router';

export const app = express()
const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)
app.use('/blogs', blogsRouters)
app.use('/posts', postsRouters)
app.use('/testing', testingRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

export const setting = {
    JWT_SECRET: process.env.JWT_SECRET || '123'
}