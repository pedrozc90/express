import { ErrorRequestHandler, Request, Response } from "express";

export type Error = {
	status_code?: number;
	message?: string;
	stack?: string;
};

export function errorHandler(): ErrorRequestHandler {
	return (error: Error, req: Request, res: Response) => {
        const url = req.url;
		const status_code = error.status_code || 500;
		const message = error.message ?? `An error occurred while processing the request for ${url}.`;
		const stack_error = error.stack;
		res.status(status_code).json({ message, stack_error });
	};
}
