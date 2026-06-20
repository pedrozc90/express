import { describe, expect, test } from "vitest";

import { prettyBytes } from "./files";

describe("FileUtils", () => {
    test("Convert 512 bytes to readable format", () => {
        const formatted = prettyBytes(512);
        expect(formatted).toBe("512 B");
    });

    test("Convert 1024 bytes to readable format", () => {
        const formatted = prettyBytes(1024);
        expect(formatted).toBe("1 KB");
    });

    test("Convert 1536 bytes to readable format", () => {
        const formatted = prettyBytes(1536);
        expect(formatted).toBe("1.5 KB");
    });

    test("Convert 1048576 bytes to readable format", () => {
        const formatted = prettyBytes(1048576);
        expect(formatted).toBe("1 MB");
    });

    test("Convert 1073741824n bytes to readable format", () => {
        const formatted = prettyBytes(1073741824n);
        expect(formatted).toBe("1 GB");
    });

    test("Convert 1500000000n bytes to readable format", () => {
        const formatted = prettyBytes(1500000000n);
        expect(formatted).toBe("1.4 GB");
    });
});
