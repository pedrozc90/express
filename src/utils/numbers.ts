export const toInt = (value: unknown): number | undefined => {
    if (typeof value === "number") return value;
    if (!value) return;
    const result = Number(value);
    if (Number.isNaN(result)) return;
    return result;
};

export const toBigInt = (value: unknown): bigint | undefined => {
    try {
        if (typeof value === "bigint") return value;
        if (typeof value === "string" || typeof value === "number") {
            return BigInt(value);
        }
        return undefined;
    } catch (e) {
        return undefined;
    }
};

export const toBoolean = (value: unknown): boolean | undefined => {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "false") return false;
        if (normalized === "true") return true;
    }

    return undefined;
};
