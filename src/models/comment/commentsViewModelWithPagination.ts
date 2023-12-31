import {CommentViewModel} from './commentViewModel';


export type PaginatorCommentViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentViewModel>
}