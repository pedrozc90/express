import { Router } from "express";
import { badRequest, healthCheck, index } from "../controllers/index.controller";

const router: Router = Router();

router.get("/", index);
router.get("/health", healthCheck);
router.get("/bad", badRequest);

export default router;
