import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {BlogMongoDbType, CommentDbType, PostMongoDbType, UserAccountDbType, UserDbType} from '../types/types';
dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log('url :', mongoURI)
if (!mongoURI) {
    throw new Error('Url is not exist')
}
const client = new MongoClient(mongoURI)
const db = client.db('api')

export const blogsCollection = db.collection<BlogMongoDbType>('blogs')
export const postsCollection = db.collection<PostMongoDbType>('posts')
export const usersCollection = db.collection<UserDbType>('users')
export const usersAccountsCollection = db.collection<UserAccountDbType>('users')
export const commentsCollection = db.collection<CommentDbType>('users')

export const runDb = async () => {
    try {
        await client.connect()
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Can\'t connect successfully to mongo server')
        await client.close()
    }
}
