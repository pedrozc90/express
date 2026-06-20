import type { JwtValidated } from "./domains/auth/auth.service";

declare global {
    namespace Express {
        interface Request {
            token?: string;
            jwt?: JwtValidated;
        }
    }
}

export {};
