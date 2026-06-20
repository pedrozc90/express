import type { Request, Response } from "express";
import { UserCreateSchema, UserUpdateSchema } from "./user.schema";
import * as UserService from "./user.service";
import { removeUndefined, toBigInt } from "../../shared/utils";
import { AppError } from "../../shared/errors";
import { FetchArgsSchema, mapPage } from "../../shared/types";
import { toUserDto } from "./user.types";

const parseId = (req: Request): bigint => {
    const value = toBigInt(req.params["id"]);
    if (!value) {
        throw AppError.badRequest({ message: "id is required" });
    }
    return value;
};

export const fetch = async (req: Request, res: Response) => {
    const args = FetchArgsSchema.parse(req.query);
    const fetched = await UserService.fetch(args);
    const result = mapPage(fetched, (u) => toUserDto(u));
    return res.status(200).json(result);
};

export const get = async (req: Request, res: Response) => {
    const id = parseId(req);
    const user = await UserService.get({ id: id });
    const result = toUserDto(user);
    return res.status(200).json(result);
};

export const create = async (req: Request, res: Response) => {
    const data = UserCreateSchema.parse(req.body);
    const user = await UserService.create(data);
    const result = toUserDto(user);
    return res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const id = parseId(req);
    const data = removeUndefined(UserUpdateSchema.parse(req.body));
    const user = await UserService.update(id, data);
    const result = toUserDto(user);
    return res.status(200).json(result);
};

export const remove = async (req: Request, res: Response) => {
    const id = parseId(req);
    const user = await UserService.remove(id);
    return res.status(200).json({ message: `User ${user.email} removed` });
};
