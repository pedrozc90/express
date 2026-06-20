import express from "express";
import { default as IndexRouter } from "./index.route";
import { FileRouter } from "../../domains/file";
import { UserRouter } from "../../domains/user";
import { RoleRouter } from "../../domains/role";

const router = express.Router();

router.use("/", IndexRouter);
router.use("/files", FileRouter);
router.use("/users", UserRouter);
router.use("/roles", RoleRouter);

export { router };
