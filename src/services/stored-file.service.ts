import type { Bytes } from "@prisma/client/runtime/client";
import type { StoredFile } from "../generated/client";
import { StoredFileRepository } from "../repos";
import { AppError, type FetchArgs } from "../types";
import { HashUtils } from "../utils";

export const get = async (id: bigint) => {
    const sf = await StoredFileRepository.findOne({ id: id });
    if (!sf) throw AppError.notFound({ message: `File ${id} not found.` });
    return sf;
};

export const getContent = async (id: bigint): Promise<Uint8Array<ArrayBuffer>> => {
    const sf = await get(id);
    if (sf.storageType === "bucket") {
        // TODO: Add s3
        throw new AppError({ status: "NOT_IMPLEMENTED", message: "S3 storage not implemented yet." });
    }
    const content = await StoredFileRepository.getContent(id);
    if (!content) throw AppError.notFound({ message: "File content not found" });

    return content as Uint8Array<ArrayBuffer>;
};

export const fetch = async (args: FetchArgs) => {
    return StoredFileRepository.fetch(args);
};

export const create = async (data: Pick<StoredFile, "filename" | "contentType" | "size"> & Required<{ content: Bytes }>) => {
    const hash = HashUtils.sha256(data.content);

    const existing = await StoredFileRepository.findOne({ hash: hash });
    if (existing) return existing;

    return StoredFileRepository.create({
        storageType: "local",
        filename: data.filename,
        contentType: data.contentType,
        size: data.size,
        content: data.content,
        hash: hash,
    });
};

export const remove = async (id: bigint): Promise<StoredFile> => {
    return StoredFileRepository.remove(id);
};
