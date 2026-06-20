import express from "express";
import { RoleController } from "../controllers";
import { authorized, permissions } from "../middlewares";

const router = express.Router();

router.get("/", authorized, permissions("user:read"), RoleController.fetch);
router.post("/", authorized, permissions("user:write"), RoleController.create);
router.get("/:id", authorized, permissions("user:read"), RoleController.get);
router.put("/:id", authorized, permissions("user:write"), RoleController.update);
router.delete("/:id", authorized, permissions("user:write"), RoleController.remove);

export default router;
