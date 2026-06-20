import bcrypt from "bcryptjs";
import { settings } from "../settings";
import { createHash } from "crypto";

/**
 * Generates a hash for the given password.
 *
 * @param password -- password to be hashed
 * @return Promise with resulting hash, if callback has been omitted
 */
export const hash = async (value: string): Promise<string> => {
    const salt = settings.hashing.salt;
    const pepper = settings.hashing.pepper;
    return bcrypt.hash(value + pepper, salt);
};

/**
 * Tests a password against a hash.
 *
 * @param  password -- password to test
 * @param  hash     -- password hash to test against
 * @return promise, if callback has been omitted
 */
export const compare = async (value: string, hash: string): Promise<boolean> => {
    const pepper = settings.hashing.pepper;
    return bcrypt.compare(value + pepper, hash);
};

/**
 * Create a sha256 hash from a string or byte[]
 *
 * @param value -- string or byte[] to be hashed
 * @returns hash string
 */
export const sha256 = (value: string | NodeJS.ArrayBufferView): string => {
    return createHash("sha256").update(value).digest("hex");
};
