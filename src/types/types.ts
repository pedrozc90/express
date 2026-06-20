import type { SignOptions } from "jsonwebtoken";

/* --- Settings --- */
export interface CorsSettings {
    enabled: boolean;
    origin?: string | string[] | undefined;
}

export interface DatabaseSettings {
    url: string;
}

export type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export interface JwtSettings {
    secret: string;
    issuer: string;
    expiresIn: JwtExpiresIn;
}

export interface HashingSettings {
    salt: number;
    pepper: string;
}

export interface Settings {
    name: string;
    version: string;
    environment: "production" | "development" | "test" | string;
    port: number;
    cors: CorsSettings;
    db: DatabaseSettings;
    jwt: JwtSettings;
    hashing: HashingSettings;
    isDev: () => boolean;
}

/* --- Generic --- */
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
