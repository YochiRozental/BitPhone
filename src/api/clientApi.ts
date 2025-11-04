import axios from "axios";
import type { ApiResponse } from "../types";

const API_BASE_URL = "https://rutg.pythonanywhere.com";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export const makeWebApiRequest = async (params: Record<string, any>): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get("/api/web", { params });
        return response.data;
    } catch (error: any) {
        console.error("Web API Error:", error.response || error.message);
        return { success: false, message: "שגיאת תקשורת עם השרת." };
    }
};
