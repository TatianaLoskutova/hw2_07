import {UserViewModel} from '../models/users/userViewModel';
import {PostMongoDbType} from './types';

declare global {
    namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}

declare global {
    namespace Express {
        export interface Request {
            postId: PostMongoDbType | null
        }
    }
}