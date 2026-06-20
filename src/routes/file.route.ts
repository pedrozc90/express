import express from "express";
import { FileController } from "../controllers";
import { authorized } from "../middlewares";
import { multer } from "../settings";

const router = express.Router();

router.get("/", authorized, FileController.fetch);
router.post("/", authorized, multer.single("file"), FileController.upload);
router.get("/:id", authorized, FileController.download);
router.delete("/:id", authorized, FileController.remove);

export default router;
