import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../shared/errors";
import { settings } from "../../../settings";

interface ErrorDto {
    message: string;
    details?: unknown;
    stack?: string;
}

const map = (e: Error, details?: unknown): ErrorDto => {
    return {
        message: e.message,
        details: details,
        ...(settings.isDev() && e.stack ? { stack: e.stack } : {}),
    };
};

const mapZod = (e: ZodError) => {
    return e.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
        input: issue.input,
    }));
};

export const error = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
        const details = mapZod(err);
        const e = AppError.badRequest({ message: "Validation failed", details, cause: err });
        return res.status(e.status).json(map(e, details));
    }

    if (err instanceof AppError) {
        return res.status(err.status).json(map(err));
    }

    // unexpected error
    console.error(err);

    return res.status(500).json(map(err));
};
