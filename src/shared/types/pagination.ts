import { z } from "zod";

export interface Page<T> {
    page: number;
    rows: number;
    count: number;
    list: T[];
}

export const createPage = <T>(page: number, rows: number, list: T[], count: number = 0): Page<T> => {
    return { page, rows, count: count ?? list.length, list };
};

export const mapPage = <T, R>(page: Page<T>, fn: (obj: T) => R): Page<R> => {
    return {
        page: page.page,
        rows: page.rows,
        count: page.count,
        list: page.list.map((v) => fn(v)),
    };
};

export interface FetchArgs {
    p: number;
    r: number;
    q?: string;
}

export const FetchArgsSchema = z.object({
    p: z.number().min(1).optional(),
    r: z.number().min(10).optional(),
    q: z.string().optional(),
}) as z.ZodType<FetchArgs>;
