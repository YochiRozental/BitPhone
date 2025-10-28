export interface User {
    phone: string;
    idNum: string;
    secret: string;
    name?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    balance?: string;
    request?: any;
    requests?: T[];
    history?: any[];
}

export interface Transaction {
    action_type: string;
    amount: string;
    description: string;
    transaction_date: string;
}

export interface RequestItem {
    id: number;
    status: "pending" | "approved" | "rejected";
    date: string;
    name: string;
    phone: string;
    amount: string;
}
