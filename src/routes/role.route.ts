import express from "express";
import { RoleController } from "../controllers";
import { authorized, permissions } from "../middlewares";

const router = express.Router();

router.get("/", authorized, permissions("role:read"), RoleController.fetch);
router.post("/", authorized, permissions("role:write"), RoleController.create);
router.get("/:id", authorized, permissions("role:read"), RoleController.get);
router.put("/:id", authorized, permissions("role:write"), RoleController.update);
router.delete("/:id", authorized, permissions("role:write"), RoleController.remove);

export default router;
