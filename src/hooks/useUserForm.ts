import { useState, useEffect } from "react";
import type { User } from "../types";

export function useUserForm(initial?: User, isRegister?: boolean) {

    const [data, setData] = useState<User>(
        initial || {
            name: "",
            phone: "",
            idNum: "",
            secret: "",
            balance: "0",
            role: "user",
            bankAccount: {
                accountNumber: "",
                bankNumber: "",
                branchNumber: "",
                accountOwner: "",
            },
        }
    );

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initial) setData(initial);
    }, [initial]);

    const onChange = (e: any) => {
        const { name, value } = e.target;

        if (["bankNumber", "branchNumber", "accountNumber", "accountOwner"].includes(name)) {
            setData((prev) => ({
                ...prev,
                bankAccount: { ...prev.bankAccount, [name]: value },
            }));
        } else {
            setData((prev) => ({
                ...prev,
                [name]: value,
                bankAccount:
                    name === "name"
                        ? { ...prev.bankAccount, accountOwner: value }
                        : prev.bankAccount,
            }));
        }

        setErrors((p: any) => ({ ...p, [name]: "" }));
    };

    const validate = () => {
        const e: any = {};

        if (!data.name.trim()) e.name = "יש להזין שם מלא";
        if (!/^0\d{8,9}$/.test(data.phone)) e.phone = "טלפון לא תקין";
        if (!/^\d{9}$/.test(data.idNum)) e.idNum = "תעודת זהות לא תקינה";
        if (data.secret.length < 4) e.secret = "קוד סודי קצר מדי";

        if (isRegister) {
            if (!/^\d{2,3}$/.test(data.bankAccount.bankNumber)) e.bankNumber = "מספר בנק לא תקין";
            if (!/^\d{1,3}$/.test(data.bankAccount.branchNumber)) e.branchNumber = "מספר סניף לא תקין";
            if (!/^\d{5,12}$/.test(data.bankAccount.accountNumber))
                e.accountNumber = "מספר חשבון לא תקין";
            if (!data.bankAccount.accountOwner.trim())
                e.accountOwner = "יש להזין שם בעל חשבון";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return { data, errors, onChange, validate };
}
