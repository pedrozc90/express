import { type Role } from "../generated/client";
import { RoleRepository } from "../repos";
import type { RoleCreateOutput, RoleUpdateOutput } from "../schemas";
import { AppError, PermissionMask, type FetchArgs, type PermissionTag } from "../types";

export type RoleCreateArgs = Pick<Role, "name" | "permission">;
export type RoleUpdateArgs = Partial<Pick<Role, "name" | "permission">>;

export const get = async (args: Parameters<typeof RoleRepository.findOne>[0]): Promise<Role> => {
    const role = await RoleRepository.findOne(args);
    if (!role) {
        let ref: unknown;
        if ("id" in args) ref = args.id;
        if ("name" in args) ref = args.name;
        throw AppError.notFound({ message: `Role ${ref} not found.` });
    }
    return role;
};

/**
 * Generate list of flags that permission embrace
 *
 * @param p -- role.permission
 * @returns list of tags
 */
export const tags = (value: bigint): string[] => {
    return Object.entries(PermissionMask)
        .map(([k, v]) => ((value & v) === v ? (k as PermissionTag) : null))
        .filter((v) => typeof v === "string");
};

const toMask = (value: PermissionTag[]): bigint => {
    return value
        .map((v) => PermissionMask[v])
        .filter((v) => typeof v === "bigint")
        .reduce((a, v) => a | v, 0n);
};

/**
 * Validate if 'role.permission' match bit mask.
 *
 * @param value -- permission 'bigint'
 * @param flag --
 * @returns true if permission contains flag.
 */
export const match = (value: bigint, flag: PermissionTag): boolean => {
    const m = PermissionMask[flag];
    if (typeof m !== "bigint") return false;
    const b = value & m; // bitwise operation
    return b === m;
};

export const matchAny = (value: bigint, flags: PermissionTag | PermissionTag[]): boolean => {
    const array = Array.isArray(flags) ? flags : [flags];
    const mask = toMask(array);
    return (value & mask) !== 0n;
};

export const matchAll = (value: bigint, flags: PermissionTag | PermissionTag[]): boolean => {
    const array = Array.isArray(flags) ? flags : [flags];
    const mask = toMask(array);
    return (value & mask) === mask;
};

export const findOne = async (args: Parameters<typeof RoleRepository.findOne>[0]): Promise<Role | null> => {
    return RoleRepository.findOne(args);
};

export const fetch = async (args: FetchArgs) => {
    return RoleRepository.fetch(args);
};

export const create = async (data: RoleCreateOutput): Promise<Role> => {
    const { name, tags } = data;

    if (name !== undefined && name.trim().length === 0) {
        throw AppError.badRequest({ message: `name '${name}' is invalid.` });
    }

    const permission = toMask(tags);

    return RoleRepository.create({
        name: name,
        permission: permission,
    });
};

export const update = async (id: bigint, input: RoleUpdateOutput): Promise<Role> => {
    const { name, tags } = input;

    if (name !== undefined && name.trim().length === 0) {
        throw AppError.badRequest({ message: `name '${name}' is invalid.` });
    }

    const permission = tags ? toMask(tags) : undefined;

    const data: Parameters<typeof RoleRepository.update>[1] = {};

    if (typeof name === "string") {
        data.name = name;
    }

    if (typeof permission === "bigint") {
        data.permission = permission;
    }

    if (Object.keys(data).length === 0) {
        throw AppError.badRequest({ message: "no fields to update" });
    }

    return RoleRepository.update(id, data);
};

export const remove = async (id: bigint): Promise<Role> => {
    const role = await get({ id });
    if (role.isDefault) {
        throw new AppError({ status: "NOT_ACCEPTABLE", message: "It is not allowed to remove the detault role" });
    }
    return RoleRepository.remove(id);
};
