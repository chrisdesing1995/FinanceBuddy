
export interface UserAudit {
    id?: string;
    userName?: string;
    fullName?: string;
}

export interface User{
    id?: string;
    name?: string;
    surName?: string;
    userName?: string;
    email?: string;
    password?: string;
    photo?: string;

    createUser?: UserAudit;
    createDate?: string;
    updateUser?: UserAudit;
    updateDate?: string;
}
