import crypto from "crypto";
import jwt from "jsonwebtoken";
import { settings } from "../../settings";
import { AppError } from "../../shared/errors";
import { HashUtils } from "../../shared/utils";
import { JwtDecodedSchema, type JwtDecoded } from "./auth.schema";

const { secret, issuer, expiresIn } = settings.jwt;

export interface JwtEncode {
    userId: string;
}

// export interface JwtDecoded {
//     userId: string;
// }

export interface JwtEncodeArgs {
    userId: string;
    subject: string;
}

export const encode = (args: JwtEncodeArgs): string => {
    const payload: JwtEncode = {
        userId: args.userId,
    };
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        issuer: issuer,
        expiresIn: expiresIn,
        subject: args.subject,
    });
};

export const decode = (token: string): JwtDecoded => {
    try {
        const payload = jwt.verify(token, secret, {
            algorithms: ["HS256"],
            issuer: issuer,
        });

        if (typeof payload === "string") {
            throw AppError.unauthorized({ message: "Invalid token payload" });
        }

        return JwtDecodedSchema.parse(payload);
    } catch (e) {
        console.error(e);
        if (e instanceof jwt.TokenExpiredError) {
            throw AppError.unauthorized({ message: `Token expired at ${e.expiredAt.toISOString()}`, cause: e });
        }
        throw AppError.unauthorized({ message: "Invalid token", cause: e });
    }
};

/**
 * Generates a refresh token.
 * @returns refresh token string.
 */
export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex");
};

export const hash = (value: string): string => {
    return HashUtils.sha256(value);
};
