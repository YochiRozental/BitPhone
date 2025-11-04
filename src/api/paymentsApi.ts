import { makeWebApiRequest } from "./clientApi";
import type { User } from "../types";

export const depositFunds = (user: User, amount: number) =>
    makeWebApiRequest({
        action: "deposit",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        amount,
    });

export const withdrawFunds = (user: User, amount: number) =>
    makeWebApiRequest({
        action: "withdraw",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        amount,
    });

export const transferFunds = (user: User, recipientPhone: string, amount: number) =>
    makeWebApiRequest({
        action: "transfer",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        recipient_phone: recipientPhone,
        amount,
    });

export const requestPayment = (user: User, recipientPhone: string, amount: number) =>
    makeWebApiRequest({
        action: "request_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        recipient_phone: recipientPhone,
        amount,
    });

export const approvePayment = (user: User, requestId: number) =>
    makeWebApiRequest({
        action: "approve_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId,
    });

export const rejectPayment = (user: User, requestId: number) =>
    makeWebApiRequest({
        action: "reject_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId,
    });

export const respondToPaymentRequest = (user: User, requestId: number, accept: boolean) =>
    makeWebApiRequest({
        action: accept ? "approve_payment" : "reject_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId
    });