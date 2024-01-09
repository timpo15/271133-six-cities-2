export enum UserType {
    simple,
    pro
}

export type User = {
    name: string;
    email: string;
    isPro: boolean;
    avatar?: string;
}

