import { Router } from "express";
import multer from "multer";

import { upload } from "../controllers/file-storage.controller";

// Multer middleware configuration
const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage: storage });

const router: Router = Router();

router.post("/", multerMiddleware.single("file"), upload);

export default router;
