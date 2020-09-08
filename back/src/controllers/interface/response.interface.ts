interface IPermission {
    permission: {
        chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    }
}

export interface IUserResponse {
    firstName: String,
    id: number,
    image: String,
    middleName: String,
    surName: String,
    username: String,
    permission: {
        chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    },
    password?: string,
}

export interface IUserAuthResponse {
    firstName: String,
    id: number,
    image: String,
    middleName: String,
    surName: String,
    username: String,
    permission: {
        chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
    }
    accessToken?: String,
    refreshToken?: String,
    accessTokenExpiredAt?: number,
    refreshTokenExpiredAt?: number,
    password?: string,
}

export interface INews {
    id: number,
    created_at: Date,
    text: String,
    title: String,
    user_id: number,
}

export interface IUserNews {
    firstName: String,
    id: number,
    image: String,
    middleName: String,
    surName: String,
    username: String
}

export interface INewsRespone {
    id: number,
    created_at: Date,
    text: String,
    title: String,
    user: {
        firstName: String,
        id: number,
        image: String,
        middleName: String,
        surName: String,
        username: String
    }
}

export interface ITokenRespone {
    accessToken: String,
    refreshToken: String,
    accessTokenExpiredAt: Date,
    refreshTokenExpiredAt: Date,
}