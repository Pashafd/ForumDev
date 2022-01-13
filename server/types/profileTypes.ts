import { IRequestWithUser } from "./types";

export interface IUserProfileEducation {
    school: string;
    degree: string;
    fieldofstudy: string;
    from: Date;
    to: Date;
    current?: boolean;
    description?: string;
}

export interface IUserProfileExperience {
    title: string;
    company: string;
    location: string;
    from: Date;
    to?: Date;
    current?: boolean;
    description?: string;
    id: string;
}

export interface IUserProfileSocial {
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
}

export interface IUserProfile {
    company?: string;
    website?: string;
    location?: string;
    status: string;
    skills: string[];
    bio?: string;
    gtihubusername?: string;
    experience: IUserProfileExperience[];
    education: IUserProfileEducation[];
    social: IUserProfileSocial;
    date: Date;
    id?: number;
}

export interface IRequestDeleteExperience extends IRequestWithUser {
    experienceId: string;
}
