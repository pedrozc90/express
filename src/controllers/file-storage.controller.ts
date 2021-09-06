import path from "path";
import { Request, Response } from "express";
import { HttpStatus, FileStorage } from "../types";

export const upload = (req: Request, res: Response) => {
	if (req.file) {
		// extracting file information
		const filepath = req.file.path;
		const filename = req.file.originalname;
		const extension = path.extname(filename).substring(1);
		const content_type = req.file.mimetype;
		const size = req.file.size;
		const content = req.file.buffer;

		const obj: FileStorage = {
			filepath,
			filename,
			extension,
			content_type,
			size,
			content,
		};

		res.status(HttpStatus.CREATED).json(obj);
	} else {
		res.status(HttpStatus.BAD_REQUEST).json({ message: "File not found." });
	}
};
