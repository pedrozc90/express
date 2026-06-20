import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../../../shared/errors";
import { AuthService } from "../../../domains/auth";
import { UserService } from "../../../domains/user";
import { RoleService } from "../../../domains/role";

const AUTHORIZATION = "Authorization";
const BEARER = "Bearer ";

export const authorized: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.header(AUTHORIZATION);
        if (!authorization || !authorization.trim().length || !authorization.startsWith(BEARER)) {
            throw AppError.unauthorized({ message: "Missing or invalid Authorization header" });
        }

        const accessToken = authorization.substring(BEARER.length).trim();

        const jwt = await AuthService.validate(accessToken);

        req.token = accessToken;
        req.jwt = jwt;

        return next();
    } catch (e) {
        if (e instanceof AppError) {
            return res.status(e.status).json({ message: e.message });
        }
        throw e;
    }
};

export const permissions = (value: string | string[]) => {
    const array = typeof value === "string" ? [value] : value;

    return async (req: Request, _res: Response, next: NextFunction) => {
        const permission = await UserService.getPermission(req.jwt.userId);

        const match = RoleService.matchAny(permission, array);
        if (!match) {
            throw AppError.forbidden({ message: `You are forbidden to use the resource ${req.method} '${req.originalUrl}'` });
        }

        next();
    };
};
