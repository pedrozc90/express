import { describe, expect, test } from "vitest";

import { toBigInt, toInt } from "./numbers";

describe("NumberUtils", () => {
    test("Parse value to integer", () => {
        const res = toInt("0");
        expect(res).toBe(0);
    });

    test("Parse value to bigint", () => {
        const res = toBigInt("0");
        expect(res).toBe(0n);
    });

    test("Parse value to bigint", () => {
        const res = toBigInt("128");
        expect(res).toBe(128n);
    });

    test("Parse value to bigint", () => {
        const res = toBigInt("a");
        expect(res).toBeUndefined();
    });
});
