import type { Role, User } from "../generated/client";
import type { UserUncheckedUpdateInput, UserWhereInput } from "../generated/models";
import { prisma } from "../libs";
import { AppError, createPage, type FetchArgs, type Page } from "../types";
import { PrismaUtils } from "../utils";

export type UserWithRole = User & { role: Role };
export type UserGetParams = { id: bigint } | { email: string };

export const findOne = async (where: UserGetParams): Promise<UserWithRole | null> => {
    if (!Object.keys(where).length) return null;
    return prisma.user.findUnique({
        where: { ...where },
        include: {
            role: true,
        },
    });
};

export const fetch = async ({ p = 1, r = 15, q }: FetchArgs): Promise<Page<User>> => {
    const limit = r;
    const offset = Math.max((p - 1) * r, 0);

    const where: UserWhereInput = {
        ...(typeof q === "string" && q.length ? { email: { contains: q, mode: "insensitive" } } : {}),
    };

    const [list, total] = await prisma.$transaction([
        prisma.user.findMany({
            where: where,
            skip: offset,
            take: limit,
            orderBy: {
                email: "asc",
            },
        }),
        prisma.user.count({ where: where }),
    ]);

    return createPage(p, r, list, total);
};

export const create = async (data: Pick<User, "email" | "password"> & { role: Role }): Promise<User> => {
    try {
        return prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                roleId: data.role.id,
                version: 1,
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2002")) {
            throw AppError.conflict({ message: "email already exists", cause: e });
        }

        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const update = async (
    id: bigint,
    input: Partial<Pick<User, "email" | "password" | "active"> & { role: Role }>,
): Promise<User> => {
    try {
        const data: UserUncheckedUpdateInput = {};
        if (input.email) data.email = input.email;
        if (input.password) data.password = input.password;
        if (input.active !== undefined) data.active = input.active;
        if (input.role) data.roleId = input.role.id;
        return prisma.user.update({
            where: { id: id },
            data: {
                ...data,
                version: { increment: 1 },
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2002")) {
            throw AppError.conflict({ message: "email already exists", cause: e });
        }

        if (PrismaUtils.isError(e, "P2025")) {
            throw AppError.notFound({ message: `user '${id}' not found`, cause: e });
        }

        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const remove = async (id: bigint): Promise<User> => {
    try {
        return prisma.user.delete({
            where: { id: id },
        });
    } catch (e) {
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const getPermission = async (id: bigint): Promise<bigint> => {
    return prisma.user
        .findFirst({
            where: { id: id },
            include: {
                role: {
                    select: {
                        permission: true,
                    },
                },
            },
        })
        .then((res) => res?.role.permission ?? BigInt(0));
};
