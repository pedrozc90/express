import { describe, expect, test } from "vitest";

import { compare, hash, sha256 } from "./hash";

describe("HashUtils", () => {
    test("Hash password", async () => {
        const res = await hash("Sanity Check");
        expect(res).toMatch(/^\$2[aby]\$/);
        expect(res.length).toBe(60);
    });

    test("Compare password with hash", async () => {
        const hashed = await hash("Sanity Check");

        const res1 = await compare("Sanity Check", hashed);
        expect(res1).toBeTruthy();

        const res2 = await compare("Wrong Password", hashed);
        expect(res2).toBeFalsy();
    });

    test("SHA256 string", () => {
        const res = sha256("Sanity Check");
        expect(res).toBe("634167fb016a782a41a7919a7ea51f5cc1e069607863231a8aa79b4468514ba0");
        expect(res.length).toBe(64);
    });

    test("SHA256 bytes", () => {
        const value = "Sanity Check";
        const buffer = Buffer.from(value, "utf-8");
        const res = sha256(buffer);
        expect(res).toBe("634167fb016a782a41a7919a7ea51f5cc1e069607863231a8aa79b4468514ba0");
        expect(res.length).toBe(64);
    });
});
