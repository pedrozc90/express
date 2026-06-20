import express from "express";
import { UserController } from "../controllers";
import { authorized, permissions } from "../middlewares";

const router = express.Router();

router.get("/", authorized, permissions("user:read"), UserController.fetch);
router.post("/", UserController.create);
router.get("/:id", authorized, permissions("user:read"), UserController.get);
router.put("/:id", authorized, permissions("admin"), UserController.update);
router.delete("/:id", authorized, permissions("admin"), UserController.remove);

export default router;
