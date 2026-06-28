import { Router } from "express";
import { healthCheck, index } from "../controllers/index.controller.ts";

const router: Router = Router();

router.get("/", index);
router.get("/health", healthCheck);

export default router;
