import {Response, Router} from 'express';
import {authValidationBearer} from '../../middlewares/authorization_validation/auth_validation_bearer';
import {contentValidation} from '../../middlewares/comments_validation/comments_validation';
import {errorsValidation} from '../../middlewares/errors_reply/errors_validation';
import {RequestWithParams, RequestWithParamsAndBody} from '../../types/types';
import {GetByIdParam} from '../../models/getById';
import {CommentInputModel} from '../../models/comment/commentInputModel';
import {commentsService} from '../../domain/comments/comments_service';
import {commentsQueryRepository} from '../../repositories/comments/comments_query_repository';
import {ObjectId} from 'mongodb';



export const commentsRouter = Router()

commentsRouter.put('/:id',
    authValidationBearer,
    contentValidation,
    errorsValidation,
    async (req: RequestWithParamsAndBody<GetByIdParam,CommentInputModel>, res: Response) => {
        const commentId = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id))
        if (!commentId) {
            res.sendStatus(404)
            return
        }
        const userId = req.user?.id
        if (commentId.commentatorInfo.userId !== userId) {
            res.sendStatus(403)
            return
        }

        const isUpdated = await commentsService.updateComment(req.params.id, req.body)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

commentsRouter.get('/:id',
    async (req:RequestWithParams<GetByIdParam>, res: Response) => {
        const result = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id))
        if (!result) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(result)
    })

commentsRouter.delete('/:id',
    authValidationBearer,
    async (req: RequestWithParams<GetByIdParam>, res: Response) => {
        const commentId = await commentsQueryRepository.findCommentById(new ObjectId(req.params.id))
        if (!commentId) {
            res.sendStatus(404)
            return
        }
        const userId = req.user?.id
        if (commentId.commentatorInfo.userId !== userId) {
            res.sendStatus(403)
            return
        }

        const isDeleted = await commentsService.deleteCommentById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })
