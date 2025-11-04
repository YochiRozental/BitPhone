import { apiClient } from "./clientApi";
import type { User, ApiResponse } from "../types";

export const getAllUsers = async (user: User): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get("/api/admin/get_all_users", {
            params: {
                phone_number: user.phone,
                secret_code: user.secret,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Admin API Error:", error.response || error.message);
        return { success: false, message: "שגיאת תקשורת עם השרת." };
    }
};
