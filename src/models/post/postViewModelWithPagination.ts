import {PostViewModel} from './postViewModel';

export type PaginatorPostViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostViewModel>
}