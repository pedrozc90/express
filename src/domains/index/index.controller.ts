import type { Request, Response } from "express";
import { AuthService, LoginSchema, RefrehSchema } from "../auth";
import { settings } from "../../settings";
import { getTimezone, PrismaUtils, toBigInt } from "../../shared/utils";
import { UserService, toUserDto } from "../user";
import { RoleService, toRoleDto } from "../role";

interface HealthCheck {
    name: string;
    version: string;
    environment: string | undefined;
    timestamp: Date;
    timezone: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}

const createHealthCheck = (timestamp = new Date()): HealthCheck => {
    const timezone = getTimezone();
    return {
        name: settings.name,
        version: settings.version,
        environment: settings.environment,
        timestamp: timestamp,
        timezone: timezone,
    };
};

export const index = (_req: Request, res: Response) => {
    return res.redirect("/health");
};

export const healthCheck = async (_req: Request, res: Response) => {
    const obj = createHealthCheck();
    return res.status(200).json(obj);
};

export const readyCheck = async (_req: Request, res: Response) => {
    const database = await PrismaUtils.healthCheck();

    const isReady = database.status === "CONNECTED";
    if (!isReady) {
        return res.status(503).json({
            status: "NOT_READY",
            message: "Database is not connected",
        });
    }

    return res.status(200).json({ status: "READY" });
};

export const login = async (req: Request, res: Response) => {
    const data = LoginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password);
    return res.status(200).json(result);
};

export const refresh = async (req: Request, res: Response) => {
    const data = RefrehSchema.parse(req.body);
    const result = await AuthService.refresh(data.refresh_token);
    return res.status(200).json(result);
};

export const logout = async (req: Request, res: Response) => {
    const userId = toBigInt(req.jwt!.userId) as bigint;
    await AuthService.logout(userId);
    return res.status(200).json({ message: "Logged out" });
};

export const me = async (req: Request, res: Response) => {
    const user = await UserService.get({ id: req.jwt!.userId });
    const tags = RoleService.tags(user.role.permission);
    return res.status(200).json({
        user: toUserDto(user),
        role: toRoleDto(user.role),
        permissions: tags,
    });
};
