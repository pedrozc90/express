import type { Bytes } from "@prisma/client/runtime/client";
import type { StoredFile } from "../../generated/client";
import * as FileRepository from "./file.repository";
import type { FetchArgs } from "../../shared/types";
import { HashUtils } from "../../shared/utils";
import { AppError } from "../../shared/errors";

export const get = async (id: bigint) => {
    const sf = await FileRepository.findOne({ id: id });
    if (!sf) throw AppError.notFound({ message: `File ${id} not found.` });
    return sf;
};

export const getContent = async (id: bigint): Promise<Uint8Array<ArrayBuffer>> => {
    const sf = await get(id);
    if (sf.storageType === "bucket") {
        // TODO: Add s3
        throw new AppError({ status: "NOT_IMPLEMENTED", message: "S3 storage not implemented yet." });
    }
    const content = await FileRepository.getContent(id);
    if (!content) throw AppError.notFound({ message: "File content not found" });

    return content as Uint8Array<ArrayBuffer>;
};

export const fetch = async (args: FetchArgs) => {
    return FileRepository.fetch(args);
};

export const create = async (data: Pick<StoredFile, "filename" | "contentType" | "size"> & Required<{ content: Bytes }>) => {
    const hash = HashUtils.sha256(data.content);

    const existing = await FileRepository.findOne({ hash: hash });
    if (existing) return existing;

    return FileRepository.create({
        storageType: "local",
        filename: data.filename,
        contentType: data.contentType,
        size: data.size,
        content: data.content,
        hash: hash,
    });
};

export const remove = async (id: bigint): Promise<StoredFile> => {
    return FileRepository.remove(id);
};
