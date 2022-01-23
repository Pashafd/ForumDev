import { IUserInfo } from "./usersTypes";
import { IRequestWithUser } from "./types";

export interface IPostLikes {
    user: IUserInfo;
    id: string;
}

export interface IPostComments {
    user?: IUserInfo;
    id?: string;
    text: string;
    avatar?: string;
    date?: Date;
}

export interface IPosts {
    user?: IUserInfo;
    text: string;
    name?: string;
    avatar?: string;
    likes?: IPostLikes[] | [];
    comments?: IPostComments[] | [];
}

export interface IPostsRequest extends IRequestWithUser {
    body: {
        postId: string;
    };
}
