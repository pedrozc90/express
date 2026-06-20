import type { Request, Response } from "express";
import type { Role } from "../../generated/client";
import { RoleCreateSchema, RoleUpdateSchema } from "./role.schema";
import * as RoleService from "./role.service";
import { FetchArgsSchema, mapPage } from "../../shared/types";
import { removeUndefined, toBigInt } from "../../shared/utils";
import { AppError } from "../../shared/errors";

type RoleDto = {
    id: string;
    name: string;
    ["default"]: boolean;
    permission: string;
    tags: string[];
};

const toDto = (obj: Role | null): RoleDto | null => {
    if (!obj) return null;
    return {
        id: obj.id.toString(),
        name: obj.name,
        ["default"]: obj.isDefault,
        permission: obj.permission.toString(),
        tags: RoleService.tags(obj.permission),
    };
};

const parseId = (req: Request): bigint => {
    const value = toBigInt(req.params["id"]);
    if (!value) {
        throw AppError.badRequest({ message: "id is required" });
    }
    return value;
};

export const fetch = async (req: Request, res: Response) => {
    const args = FetchArgsSchema.parse(req.query);
    const fetched = await RoleService.fetch(args);
    const result = mapPage(fetched, (u) => toDto(u));
    return res.status(200).json(result);
};

export const get = async (req: Request, res: Response) => {
    const id = parseId(req);
    const user = await RoleService.get({ id: id });
    const result = toDto(user);
    return res.status(200).json(result);
};

export const create = async (req: Request, res: Response) => {
    const data = RoleCreateSchema.parse(req.body);
    const role = await RoleService.create(data);
    const result = toDto(role);
    return res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const id = parseId(req);
    console.log("UPDATE", req.body);
    const data = removeUndefined(RoleUpdateSchema.parse(req.body));
    console.log("UPDATE", data);
    const role = await RoleService.update(id, data);
    const result = toDto(role);
    return res.status(200).json(result);
};

export const remove = async (req: Request, res: Response) => {
    const id = parseId(req);
    const role = await RoleService.remove(id);
    return res.status(200).json({ message: `Role ${role.name} removed` });
};
