import express from "express";
import { FileController } from "../controllers";
import { authorized, permissions } from "../middlewares";
import { multer } from "../settings";

const router = express.Router();

router.get("/", authorized, permissions("file:read"), FileController.fetch);
router.post("/", authorized, permissions("file:write"), multer.single("file"), FileController.upload);
router.get("/:id", authorized, permissions("file:read"), FileController.download);
router.delete("/:id", authorized, permissions("file:write"), FileController.remove);

export default router;
