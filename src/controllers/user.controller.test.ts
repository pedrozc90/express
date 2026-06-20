import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app";
import { UserService } from "../services";
import type { User } from "../generated/client";

vi.mock("../services", async () => {
    const actual = await vi.importActual("../services");
    return {
        ...actual,
        UserService: {
            get: vi.fn(),
            fetch: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
            getPermission: vi.fn(),
        },
    };
});

vi.mock("../middlewares", async () => {
    const actual = await vi.importActual("../middlewares");
    return {
        ...actual,
        authorized: (_req: any, _res: any, next: any) => {
            _req.jwt = { userId: 1n };
            next();
        },
        permissions: () => (_req: any, _res: any, next: any) => next(),
    };
});

const createUser = (): User => {
    return {
        id: 1n,
        insertedAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        email: "test@example.com",
        password: "hidden",
        active: true,
        roleId: 1n,
    };
};

describe("UserController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("GET /users/:id returns a user", async () => {
        vi.mocked(UserService.get).mockResolvedValue(createUser() as any);

        const res = await request(app).get("/users/1").set("Authorization", "Bearer fake-token");

        expect(res.status).toBe(200);
    });
});
