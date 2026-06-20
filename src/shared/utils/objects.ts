export function removeUndefined<T extends object>(obj: T): Partial<{ [K in keyof T]: Exclude<T[K], undefined> }> {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as Partial<{
        [K in keyof T]: Exclude<T[K], undefined>;
    }>;
}
