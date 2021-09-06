import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const BEARER_REGEXP = new RegExp(/(?:Bearer)\s*(.+?)/i);

export function authenticated(): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		const header: string | undefined = req.header("Authorization");
		if (!header) {
			return res.status(401).json({ message: "Authorization header not found." });
		}

		const matcher = BEARER_REGEXP.exec(header);
		if (!matcher) {
			return res.status(401).json({ message: "Invalid Bearer." });
		}

		const token = matcher[1] ?? null;
		if (!token) {
			return res.status(401).json({ message: "Token not found." });
		}

		const decoded: JwtPayload | string = jwt.verify(token, process.env["JWT_SECRET"] as Secret);
		console.log(decoded);

		res.locals["decoded"] = decoded;

		return next();
	};
}
