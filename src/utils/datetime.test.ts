import { describe, expect, test } from "vitest";
import { getTimezone } from "./datetime";

describe("DatetimeUtils", () => {
    test("Get timezone", () => {
        const timezone = getTimezone();
        expect(timezone).toBe("America/Sao_Paulo");
    });
});
