import type { JwtValidated } from "./services/auth.service";
import { JwtPayload } from "./services/auth.service";

declare global {
    namespace Express {
        interface Request {
            token?: string;
            jwt?: JwtValidated;
        }
    }
}

export {};
