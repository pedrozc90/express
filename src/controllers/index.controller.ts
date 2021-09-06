import { Request, Response } from "express";
import { HttpStatus, HealthCheck, createHealthCheck } from "../types";

export const index = (req: Request, res: Response) => {
	res.redirect("health");
};

export const healthCheck = (req: Request, res: Response) => {
	const env: string = req.app.get("env");
	const name: string = req.app.get("name");
	const version: string = req.app.get("version");
	const result: HealthCheck = createHealthCheck({ name, version, env });
	res.status(HttpStatus.OK).json(result);
};

export const badRequest = (req: Request, res: Response) => {
	throw new Error("Method Not Implemented.");
};
