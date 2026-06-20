import multer from "multer";
import { AppError } from "../../shared/errors";

const ALLOWED = ["text/plain", "text/csv", "image/png", "image/jpeg", "application/json", "application/pdf"];

export const storage = multer.memoryStorage();
export const middleware = multer({
    storage,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (_res, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
            cb(new AppError({ status: "NOT_ACCEPTABLE", message: "unsupported file type." }));
            return;
        }
        cb(null, true);
    },
});
