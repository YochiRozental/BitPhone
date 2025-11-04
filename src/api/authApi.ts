import type { User } from "../types";
import { makeWebApiRequest } from "./clientApi";

export const openAccount = (
    phone: string,
    idNum: string,
    secret: string,
    name: string,
    bankNumber: string,
    branchNumber: string,
    accountNumber: string
) =>
    makeWebApiRequest({
        action: "open_account",
        phone_number: phone,
        id_number: idNum,
        secret_code: secret,
        name,
        bank_number: bankNumber,
        branch_number: branchNumber,
        account_number: accountNumber,
    });

export const authenticateUser = (phone: string, idNum: string, secret: string) =>
    makeWebApiRequest({
        action: "authenticate",
        phone_number: phone,
        id_number: idNum,
        secret_code: secret,
    });

export const updateUser = (user: User) =>
    makeWebApiRequest({
        action: "update_user",
        ...user,
    });