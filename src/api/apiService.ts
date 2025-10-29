import axios from "axios";
import type { User, ApiResponse } from "../types";

const API_BASE_URL = "https://rutg.pythonanywhere.com";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const makeWebApiRequest = async (params: Record<string, any>): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get("/api/web", { params });
        return response.data;
    } catch (error: any) {
        console.error("Web API Error:", error.response || error.message);
        return { success: false, message: "שגיאת תקשורת עם השרת." };
    }
};

export const openAccount = (phone: string, idNum: string, secret: string, name: string) =>
    makeWebApiRequest({
        action: "open_account",
        phone_number: phone,
        id_number: idNum,
        secret_code: secret,
        name
    });

export const authenticateUser = (phone: string, idNum: string, secret: string) =>
    makeWebApiRequest({
        action: "authenticate",
        phone_number: phone,
        id_number: idNum,
        secret_code: secret
    });

export const checkBalance = (user: User) =>
    makeWebApiRequest({
        action: "check_balance",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });

export const depositFunds = (user: User, amount: number) =>
    makeWebApiRequest({
        action: "deposit",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        amount
    });

export const withdrawFunds = (user: User, amount: number) =>
    makeWebApiRequest({
        action: "withdraw",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        amount
    });

export const transferFunds = (user: User, recipientPhone: string, amount: number) =>
    makeWebApiRequest({
        action: "transfer",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        recipient_phone: recipientPhone,
        amount
    });

export const requestPayment = (user: User, recipientPhone: string, amount: number) =>
    makeWebApiRequest({
        action: "request_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        recipient_phone: recipientPhone,
        amount
    });

export const approvePayment = (user: User, requestId: number) =>
    makeWebApiRequest({
        action: "approve_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId
    });

export const rejectPayment = (user: User, requestId: number) =>
    makeWebApiRequest({
        action: "reject_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId
    });

export const getTransactionHistory = (user: User) =>
    makeWebApiRequest({
        action: "get_history",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });

export const getPaymentRequests = (user: User) =>
    makeWebApiRequest({
        action: "get_payment_requests",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });

export const getSentPaymentRequests = (user: User) =>
    makeWebApiRequest({
        action: "get_sent_payment_requests",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });

export const respondToPaymentRequest = (user: User, requestId: number, accept: boolean) =>
    makeWebApiRequest({
        action: accept ? "approve_payment" : "reject_payment",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
        request_id: requestId
    });

export const getAllUsers = (user: User) =>
    makeWebApiRequest({
        action: "get_all_users",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });

export const getTransactions = (user: User) =>
    makeWebApiRequest({
        action: "get_transactions",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret
    });
