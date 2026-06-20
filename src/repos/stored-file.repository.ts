import type { Prisma, StoredFile } from "../generated/client";
import { prisma } from "../libs";
import { AppError, createPage, type FetchArgs, type Page } from "../types";
import { PrismaUtils } from "../utils";

export type StoredFileMeta = Prisma.StoredFileGetPayload<{
    omit: { content: true };
}>;

export type StoredFileInput = Pick<StoredFile, "hash" | "filename" | "contentType" | "content" | "size" | "storageType">;

export const findOne = async (args: Pick<StoredFile, "id"> | Pick<StoredFile, "hash">): Promise<StoredFileMeta | null> => {
    return prisma.storedFile.findUnique({
        where: { ...args },
        omit: { content: true },
    });
};

export const getContent = async (id: bigint) => {
    try {
        return prisma.storedFile
            .findUnique({
                select: { content: true },
                where: { id: id },
            })
            .then((res) => res?.content ?? null);
    } catch (e) {
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const fetch = async ({ p = 1, r = 15, q }: FetchArgs): Promise<Page<StoredFile>> => {
    const limit = r;
    const offset = Math.max((p - 1) * r, 0);

    return prisma.storedFile
        .findMany({
            where: {
                ...(typeof q === "string" && q.trim().length ? { filename: { contains: q.trim(), mode: "insensitive" } } : {}),
            },
            orderBy: {
                id: "asc",
            },
            skip: offset,
            take: limit,
        })
        .then((res) => createPage<StoredFile>(p, r, res));
};

export const create = async ({
    storageType = "local",
    hash,
    filename,
    contentType,
    content,
    size = BigInt(0),
}: StoredFileInput): Promise<StoredFile> => {
    try {
        return prisma.storedFile.create({
            data: {
                storageType: storageType,
                objectKey: null,
                etag: null,
                hash: hash,
                filename: filename,
                contentType: contentType,
                content: content,
                size: size,
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2002")) {
            throw AppError.conflict({ message: `Unique constraint violation, file hash '${hash}' already exists`, cause: e });
        }
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const update = async (id: bigint, data: Partial<Pick<StoredFile, "filename">>): Promise<StoredFile> => {
    try {
        return prisma.storedFile.update({
            where: { id: id },
            data: {
                ...data,
                version: { increment: 1 },
            },
        });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2025")) {
            throw AppError.notFound({ message: `stored_file '${id}' not found`, cause: e });
        }
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const remove = async (id: bigint): Promise<StoredFile> => {
    try {
        return prisma.storedFile.delete({ where: { id: id } });
    } catch (e) {
        if (PrismaUtils.isError(e, "P2025")) {
            throw AppError.notFound({ message: `stored_file '${id}' not found`, cause: e });
        }
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};
