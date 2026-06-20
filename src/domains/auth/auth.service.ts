import type { RefreshToken } from "../../generated/client";
import { AppError } from "../../shared/errors";
import { HashUtils, toBigInt } from "../../shared/utils";
import * as UserService from "../user/user.service";
import * as RefreshTokenRepository from "./refresh-token.repository";
import * as TokenService from "./token.service";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface JwtValidated {
    subject: string;
    issuer: string;
    issuedAt: Date;
    expiresAt: Date;
    userId: bigint;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const user = await UserService.get({ email });

    if (!user.active) {
        throw AppError.unauthorized({ message: "Account is inactive" });
    }

    const match = await HashUtils.compare(password, user?.password ?? "");
    if (!match) {
        throw AppError.unauthorized({ message: "Invalid email or password" });
    }

    const accessToken = TokenService.encode({
        subject: user.email,
        userId: user.id.toString(),
    });

    const refreshToken = TokenService.generateRefreshToken();
    await persistRefreshToken(refreshToken, user.id);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

export const logout = async (userId: bigint): Promise<void> => {
    const deleted = await RefreshTokenRepository.remove({ userId });
    console.debug(`Deleted ${deleted} refresh tokens`);
};

export const validate = async (accessToken: string): Promise<JwtValidated> => {
    const decoded = TokenService.decode(accessToken);
    const userId = toBigInt(decoded.userId);
    if (!userId) {
        throw AppError.unauthorized({ message: "Invalid token: missing user id" });
    }
    return {
        subject: decoded.sub,
        issuer: decoded.iss,
        issuedAt: new Date(decoded.iat * 1_000),
        expiresAt: new Date(decoded.exp * 1_000),
        userId,
    };
};

/**
 * Persist a refresh token in the database.
 * @param token -- refresh token hashed
 * @param user -- user
 */
const persistRefreshToken = async (token: string, userId: bigint, now: Date = new Date()): Promise<RefreshToken> => {
    const expiresAt = now;
    expiresAt.setDate(expiresAt.getDate() + 7);

    const hashed = TokenService.hash(token);

    return RefreshTokenRepository.create({
        token: hashed,
        userId,
        expiresAt,
    });
};

export const refresh = async (token: string): Promise<AuthResponse> => {
    const hashed = TokenService.hash(token);

    const now = new Date();

    const stored = await RefreshTokenRepository.findOne({ token: hashed });

    if (!stored) {
        throw AppError.unauthorized({ message: "Invalid refresh token" });
    } else if (stored.expiresAt < now) {
        throw AppError.unauthorized({ message: "Refresh token is expired" });
    }

    const userId = stored.userId;

    const deleted = await RefreshTokenRepository.remove({ token: hashed, userId });

    // token wasn't found - possible reuse attack
    if (!deleted) {
        await RefreshTokenRepository.remove({ userId });
        throw AppError.unauthorized({ message: "Refresh token reuse detected" });
    }

    const user = stored.user;
    const accessToken = TokenService.encode({
        subject: user.email,
        userId: user.id.toString(),
    });

    const newToken = TokenService.generateRefreshToken();
    await persistRefreshToken(newToken, userId, now);

    return {
        accessToken,
        refreshToken: newToken,
    };
};
