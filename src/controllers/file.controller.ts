import type { Request, Response } from "express";
import type { StoredFile } from "../generated/client";
import { StoredFileService } from "../services";
import { AppError, mapPage } from "../types";
import { FileUtils, toBigInt } from "../utils";
import { FetchArgsSchema } from "../schemas";

type StoredFileDto = {
    id: string;
    inserted_at: string;
    updated_at: string;
    version: number;
    hash: string;
    filename: string;
    content_type: string;
    size: string;
    object_key?: string;
    etag?: string;
};

const toDto = (file: StoredFile | null): StoredFileDto | null => {
    if (!file) return null;
    return {
        id: file.id.toString(),
        inserted_at: file.insertedAt.toISOString(),
        updated_at: file.updatedAt.toISOString(),
        version: file.version,
        hash: file.hash,
        filename: file.filename,
        content_type: file.contentType,
        size: FileUtils.prettyBytes(file.size),
        ...(file.objectKey ? { object_key: file.objectKey } : {}),
        ...(file.etag ? { etag: file.etag } : {}),
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
    const fetched = await StoredFileService.fetch(args);
    const results = mapPage(fetched, (v) => toDto(v));
    return res.status(200).json(results);
};

export const upload = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        throw AppError.badRequest({ message: "File not found." });
    }

    // Buffer.from() produces a Buffer backed by a plain ArrayBuffer,
    // satisfying Prisma's Bytes (Uint8Array<ArrayBuffer>) type.
    const content = Buffer.from(file.buffer.buffer, file.buffer.byteOffset, file.buffer.byteLength) as Uint8Array<ArrayBuffer>;

    const sf = await StoredFileService.create({
        filename: file.originalname ?? file.filename,
        contentType: file.mimetype,
        content: content,
        size: toBigInt(file.size) ?? BigInt(0),
    });

    const result = toDto(sf as StoredFile);

    return res.status(201).json(result);
};

export const download = async (req: Request, res: Response) => {
    const id = parseId(req);

    const sf = await StoredFileService.get(id);

    const content = await StoredFileService.getContent(id);
    if (!content) throw AppError.notFound({ message: "File content not found" });

    res.setHeader("Content-Type", sf.contentType);
    res.setHeader("Content-Length", content.byteLength);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(sf.filename)}"`);
    return res.status(200).send(content);
};

export const remove = async (req: Request, res: Response) => {
    const id = parseId(req);
    const sf = await StoredFileService.remove(id);
    return res.status(200).json({ message: `File ${sf.filename} deleted.` });
};
