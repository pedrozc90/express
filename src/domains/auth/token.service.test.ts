import { describe, expect, it } from "vitest";
import * as TokenService from "./token.service";

describe("TokenService", () => {
    it("Encode JWT Token", () => {
        const res = TokenService.encode({
            userId: "0n",
            subject: "vitest@email.com",
        });
        expect(res).toBeTypeOf("string");
    });

    it("Decode JWT Token", () => {
        const token = TokenService.encode({
            userId: "0",
            subject: "vitest@email.com",
        });
        const res = TokenService.decode(token);
        expect(res).toBeTypeOf("object");
        expect(res.userId).toBe("0");
        expect(res.iss).toBe("vitest");
        expect(res.sub).toBe("vitest@email.com");
    });
});
