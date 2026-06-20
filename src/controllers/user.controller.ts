import type { Request, Response } from "express";
import { FetchArgsSchema, UserCreateSchema, UserUpdateSchema } from "../schemas";
import { UserService } from "../services";
import { AppError, mapPage, toUserDto } from "../types";
import { removeUndefined, toBigInt } from "../utils";

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
