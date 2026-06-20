import type { Role } from "../generated/client";
import type { RoleCreateInput, RoleWhereInput } from "../generated/models";
import { prisma } from "../libs";
import { AppError, createPage, type FetchArgs, type Page } from "../types";
import { PrismaUtils } from "../utils";

export type RoleCreateArgs = Pick<Role, "name" | "permission">;
export type RoleUpdateArgs = Partial<Pick<RoleCreateInput, "name" | "permission">>;

export const findOne = async (where: Pick<Role, "id"> | Pick<Role, "name"> | Pick<Role, "isDefault">): Promise<Role | null> => {
    if (!Object.keys(where).length) return null;
    return prisma.role.findUnique({
        where: { ...where },
    });
};

export const fetch = async ({ p = 1, r = 15, q }: FetchArgs): Promise<Page<Role>> => {
    const limit = r;
    const offset = Math.max((p - 1) * r, 0);

    const where: RoleWhereInput = {
        ...(typeof q === "string" && q.length ? { name: { contains: q, mode: "insensitive" } } : {}),
    };

    const [list, total] = await prisma.$transaction([
        prisma.role.findMany({
            where: {
                ...(typeof q === "string" && q.length ? { name: { contains: q, mode: "insensitive" } } : {}),
            },
            skip: offset,
            take: limit,
            orderBy: {
                name: "asc",
            },
        }),
        prisma.role.count({ where: where }),
    ]);

    return createPage<Role>(p, r, list, total);
};

export const create = async (data: RoleCreateArgs): Promise<Role> => {
    try {
        return prisma.role.create({
            data: {
                name: data.name,
                permission: data.permission,
                isDefault: false,
                version: 1,
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2002")) {
            throw AppError.conflict({ message: "Role with name already exists", cause: e });
        }
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const update = async (id: bigint, data: RoleUpdateArgs): Promise<Role> => {
    try {
        return prisma.role.update({
            where: { id: id },
            data: {
                ...data,
                version: { increment: 1 },
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2002")) {
            throw AppError.conflict({ message: "Role with name already exists", cause: e });
        }

        if (PrismaUtils.isError(e, "P2025")) {
            throw AppError.notFound({ message: `Role '${id}' not found`, cause: e });
        }
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const remove = async (id: bigint): Promise<Role> => {
    try {
        return prisma.role.delete({
            where: { id: id },
        });
    } catch (e) {
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};
