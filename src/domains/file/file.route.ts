import express from "express";
import * as FileController from "./file.controller";
import { authorized } from "../../infra/http/middlewares";
import { multer } from "../../infra/storage";

const router = express.Router();

router.get("/", authorized, FileController.fetch);
router.post("/", authorized, multer.single("file"), FileController.upload);
router.get("/:id", authorized, FileController.download);
router.delete("/:id", authorized, FileController.remove);

export default router;
