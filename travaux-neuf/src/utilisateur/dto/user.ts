export interface userIdentity {
    nom : string,
    prenom : string
}

export interface emailUser {
    email : string
}

export interface updateToken{
    refreshToken: string,
    refreshTokenExp: string,
}