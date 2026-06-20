import express from "express";
import { IndexController } from "../../domains/index";
import { authorized } from "../../infra/http/middlewares";

const router = express.Router();

router.get("/", IndexController.index);
router.get("/health", IndexController.healthCheck);
router.get("/ready", IndexController.readyCheck);
router.post("/login", IndexController.login);
router.post("/refresh", IndexController.refresh);
router.post("/logout", authorized, IndexController.logout);
router.get("/me", authorized, IndexController.me);

export default router;
