import axios from "axios";
import type { User, ApiResponse } from "../types";

const API_BASE_URL = "https://rutg.pythonanywhere.com";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const makeWebApiRequest = async (params: Record<string, any>): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get("/api/web", { params });
        return response.data;
    } catch (error: any) {
        console.error("Web API Error:", error.response || error.message);
        return { success: false, message: "שגיאת תקשורת עם השרת." };
    }
};

export const openAccount = (phone: string, idNum: string, secret: string, name: string) =>
    makeWebApiRequest({ action: "open_account", phone_number: phone, id_number: idNum, secret_code: secret, name });

export const authenticateUser = (phone: string, idNum: string, secret: string) =>
    makeWebApiRequest({ action: "authenticate", phone_number: phone, id_number: idNum, secret_code: secret });

export const checkBalance = (user: User): Promise<ApiResponse<{ balance: number }>> =>
    makeWebApiRequest({ action: "check_balance", phone_number: user.phone, id_number: user.idNum, secret_code: user.secret });

export const depositFunds = (user: User, amount: number) =>
    makeWebApiRequest({ action: "deposit", phone_number: user.phone, id_number: user.idNum, secret_code: user.secret, amount });

export const withdrawFunds = (user: User, amount: number) =>
    makeWebApiRequest({ action: "withdraw", phone_number: user.phone, id_number: user.idNum, secret_code: user.secret, amount });

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

// export const getTransactionHistory = (user: User): Promise<ApiResponse<Transaction[]>> =>
//     makeWebApiRequest({
//         action: "get_history",
//         phone_number: user.phone,
//         id_number: user.idNum,
//         secret_code: user.secret,
//     });

export const getTransactionHistory = (user: User): Promise<ApiResponse> =>
    makeWebApiRequest({
        action: "get_history",
        phone_number: user.phone,
        id_number: user.idNum,
        secret_code: user.secret,
    });

export async function getPaymentRequests(user: User) {
    const res = await fetch(`/api/payment-requests?userId=${user.idNum}`);
    if (!res.ok) throw new Error("Failed to fetch payment requests");
    return await res.json();
}

export async function respondToPaymentRequest(user: User, requestId: string, approve: boolean) {
    const res = await fetch(`/api/payment-requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.idNum, approve }),
    });
    if (!res.ok) throw new Error("Failed to update payment request");
    return await res.json();
}
