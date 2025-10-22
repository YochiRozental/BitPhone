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
}

export interface Transaction {
    action_type: string;
    amount: string;
    description: string;
    transaction_date: string;
}
