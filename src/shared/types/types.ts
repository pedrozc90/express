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
