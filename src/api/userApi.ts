import { makeWebApiRequest } from "./clientApi";
import type { User } from "../types";

export const checkBalance = (user: User) =>
    makeWebApiRequest({
        action: "check_balance",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });

export const getTransactionHistory = (user: User) =>
    makeWebApiRequest({
        action: "get_history",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });

export const getTransactions = (user: User) =>
    makeWebApiRequest({
        action: "get_transactions",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });

export const getPaymentRequests = (user: User) =>
    makeWebApiRequest({
        action: "get_payment_requests",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });

export const getSentPaymentRequests = (user: User) =>
    makeWebApiRequest({
        action: "get_sent_payment_requests",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });