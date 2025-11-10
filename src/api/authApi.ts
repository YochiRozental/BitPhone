import type { User } from "../types";
import { makeWebApiRequest } from "./clientApi";

export const openAccount = (phone: string, idNum: string, secret: string, name: string, bankNumber: string, branchNumber: string, accountNumber: string) =>
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

export const loginUser = (phone: string, idNum: string, secret: string) =>
    makeWebApiRequest({
        action: "authenticate",
        phone_number: phone,
        id_number: idNum,
        secret_code: secret,
    });

export const updateUser = (user: User) =>
    makeWebApiRequest({
        action: "update_user",

        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,

        name: user.name,
        secret: user.secret,

        bank_number: user.bankAccount.bankNumber,
        branch_number: user.bankAccount.branchNumber,
        account_number: user.bankAccount.accountNumber,
        account_holder_name: user.bankAccount.accountOwner,
    });
