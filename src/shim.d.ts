import { JwtPayload } from "./services/auth.service";

declare global {
    namespace Express {
        interface Request {
            token?: string;
            jwt?: JwtPayload;
        }
    }
}

export {};
