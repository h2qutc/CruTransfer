export interface IResponse {
    success: boolean;
    message: any;
    payload: any;
}

export interface IPagedResponse {
    docs: any[];
    status: boolean;

    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    pagingCounter: number;
    prevPage: number;
    total: number;
    pages: number;

}

export interface IPagedOptions {
    page: number;
    limit: number;
    search: string;
    orderBy: string;
}
