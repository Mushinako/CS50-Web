interface Node {
    appendText(str: string): void,
    clearChildren(): void,
}

interface GetPostArgs {
    startTime?: string,
    users?: string,
}

interface ErrorResponse {
    err: string,
}

interface SuccessResponse {
    msg: string,
}

interface GetPostResponse {
    posts: PostData[],
    more: boolean,
    loggedIn: boolean,
}

interface PostData {
    id: number,
    username: string,
    content: string,
    isAuthor: boolean,
    creationTime: string,
    editTime: string | null,
    liked: boolean,
    likeCount: number,
}

type PotentialErrorResponse<T> = T | ErrorResponse | undefined;
