import dayjs, { Dayjs } from "dayjs";
import type { DateFilter } from "../../../types";

/**
 * פונקציה גנרית לסינון ומיון נתונים
 * @param data רשימת הנתונים הגולמית
 * @param filter סוג הסינון לפי תאריך
 * @param customStartDate תאריך התחלה (לטווח מותאם אישית)
 * @param customEndDate תאריך סיום (לטווח מותאם אישית)
 * @param sortColumn שם העמודה למיון
 * @param sortDirection כיוון המיון ("asc" / "desc")
 * @param getActionType פונקציה אופציונלית שמחזירה אובייקט עם צבע או תווית — לדוגמה עבור פעולות כספיות
 */

export function filterAndSortTransactions<T extends Record<string, any>>(
    data: T[],
    filter: DateFilter,
    customStartDate: Dayjs | null,
    customEndDate: Dayjs | null,
    sortColumn: keyof T,
    sortDirection: "asc" | "desc",
    getActionType?: (action: string) => { label: string; color: string }
): T[] {
    if (!Array.isArray(data)) return [];

    // סינון לפי תאריך
    let filtered = data;

    if (filter !== "all") {
        const now = dayjs();
        let start: Dayjs | null = null;
        let end: Dayjs | null = null;

        switch (filter) {
            case "today":
                start = now.startOf("day");
                end = now.endOf("day");
                break;
            case "week":
                start = now.startOf("week");
                end = now.endOf("week");
                break;
            case "month":
                start = now.startOf("month");
                end = now.endOf("month");
                break;
            case "custom":
                if (customStartDate && customEndDate) {
                    start = customStartDate.startOf("day");
                    end = customEndDate.endOf("day");
                }
                break;
        }

        if (start && end) {
            filtered = filtered.filter((item) => {
                const dateValue = item.transaction_date || item.date || item.createdAt;
                if (!dateValue) return false;
                const date = dayjs(dateValue);
                return date.isAfter(start) && date.isBefore(end);
            });
        }
    }

    // מיון לפי עמודה
    const sorted = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // טיפול במחרוזות/מספרים/תאריכים
        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        const aTime = new Date(aValue).getTime();
        const bTime = new Date(bValue).getTime();
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });

    // אפשרות לעיבוד נוסף (למשל צבעים לפעולות)
    if (getActionType) {
        return sorted.map((item) => {
            const action = (item as any).action_type;
            return action ? { ...item, actionMeta: getActionType(action) } : item;
        });
    }

    return sorted;
}
