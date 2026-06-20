import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(6).max(32),
});

export const JwtDecodedSchema = z.object({
    iat: z.number(),
    exp: z.number(),
    iss: z.string(),
    sub: z.string(),
    userId: z.string(),
});

export type JwtDecoded = z.output<typeof JwtDecodedSchema>;

export const RefrehSchema = z.object({
    refresh_token: z.string(),
});
