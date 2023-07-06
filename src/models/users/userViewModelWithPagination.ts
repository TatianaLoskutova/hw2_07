import {UserViewModel} from './userViewModel';


export type PaginatorUserViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserViewModel>
}