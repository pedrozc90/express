import { NextFunction, Request, RequestHandler, Response } from "express";

export function loggerHandler(): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		console.log(`${req.method} ${req.url}`, { body: req.body, params: req.params }, res);
		next();
	};
}
