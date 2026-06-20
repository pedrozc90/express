import { type User } from "../../generated/client";
import * as UserRepository from "./user.repository";
import type { FetchArgs } from "../../shared/types";
import { HashUtils } from "../../shared/utils";
import { RoleService } from "../role";
import { AppError } from "../../shared/errors";

export type UserCreateArgs = Pick<User, "email" | "password">;
export type UserUpdateArgs = Partial<Pick<User, "email" | "password" | "active">>;

const isValidEmail = (value?: string | null | undefined): boolean => {
    if (typeof value !== "string") return false;
    if (value.length > 255) return false;

    const at = value.indexOf("@");
    if (at <= 0 || at !== value.lastIndexOf("@")) return false;

    const domain = value.slice(at + 1);
    return domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".");
};

const isValidPassword = (value?: string | null | undefined): boolean => {
    return typeof value === "string" && value.length >= 6 && value.length <= 32;
};

export const get = async (args: { id: bigint } | { email: string }) => {
    const user = await UserRepository.findOne(args);
    if (!user) {
        const ref = "id" in args ? args.id : args.email;
        throw AppError.notFound({ message: `User ${ref} not found.` });
    }
    return user;
};

export const findOne = async (args: { id: bigint } | { email: string }): Promise<User | null> => {
    return UserRepository.findOne(args);
};

export const getPermission = async (id: bigint): Promise<bigint> => {
    return UserRepository.getPermission(id);
};

export const fetch = async (args: FetchArgs) => {
    return UserRepository.fetch(args);
};

export const create = async (data: UserCreateArgs): Promise<User> => {
    const { email, password } = data;

    if (!email || !password) {
        throw AppError.badRequest({ message: "email and password are required." });
    }

    if (!isValidEmail(email)) {
        throw AppError.badRequest({ message: `email '${email}' is invalid.` });
    }

    if (!isValidPassword(password)) {
        throw AppError.badRequest({ message: "password must have between 6 and 32 characters." });
    }

    const hashed = await HashUtils.hash(password);

    const role = await RoleService.get({ isDefault: true });

    return UserRepository.create({
        email: email,
        password: hashed,
        role: role,
    });
};

export const update = async (id: bigint, input: UserUpdateArgs): Promise<User> => {
    const { email, password } = input;
    // const role = validateRole(input.role);

    if (email && !isValidEmail(email)) {
        throw AppError.badRequest({ message: `email '${email}' is invalid.` });
    }

    if (password && !isValidPassword(password)) {
        throw AppError.badRequest({ message: "password must have between 6 and 32 characters." });
    }

    // if (input.role && !role) {
    //     throw AppError.badRequest({ message: `role '${input.role} is invalid.` });
    // }

    const data: Parameters<typeof UserRepository.update>[1] = {};

    if (typeof email === "string") {
        data.email = email;
    }

    if (typeof password === "string") {
        data.password = await HashUtils.hash(password);
    }

    // if (role) {
    //     data.role = role;
    // }

    if (Object.keys(data).length === 0) {
        throw AppError.badRequest({ message: "no fields to update" });
    }

    return UserRepository.update(id, data);
};

export const remove = async (id: bigint): Promise<User> => {
    return UserRepository.remove(id);
};
