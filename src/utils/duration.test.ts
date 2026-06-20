import { describe, expect, test } from "vitest";

import { formatDuration, parseDuration } from "./duration";

describe("DurationUtils", () => {
    test("Parse '3 days' to milliseconds", () => {
        const res = parseDuration("3 days", "milliseconds");
        expect(res).toBe(259200000);
    });

    test("Parse milliseconds to days (long)", () => {
        const res = formatDuration(259200000, "ms", { style: "long" });
        expect(res).toBe("3 days");
    });

    test("Parse milliseconds to days (short)", () => {
        const res = formatDuration(259200000, "ms", { style: "short" });
        expect(res).toBe("3d");
    });
});
