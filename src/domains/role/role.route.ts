import express from "express";
import * as RoleController from "./role.controller";
import { authorized, permissions } from "../../infra/http/middlewares";

const router = express.Router();

router.get("/", authorized, permissions("role:read"), RoleController.fetch);
router.post("/", authorized, permissions("role:write"), RoleController.create);
router.get("/:id", authorized, permissions("role:read"), RoleController.get);
router.put("/:id", authorized, permissions("role:write"), RoleController.update);
router.delete("/:id", authorized, permissions("role:write"), RoleController.remove);

export default router;
