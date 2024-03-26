import { UserAudit } from "./user";

export interface GeneralParameter {
    id?: string;
    code?: string;
    description?: string;
    generalParameterDetails?: GeneralParameterDetails[];

    createUser?: UserAudit;
    createDate?: string;
    updateUser?: UserAudit;
    updateDate?: string;
}

export interface GeneralParameterDetails {
    id?: string;
    line?:number;
    code?: string;
    value1?: string;
    description?: string;

    createUser?: UserAudit;
    createDate?: string;
    updateUser?: UserAudit;
    updateDate?: string;
}