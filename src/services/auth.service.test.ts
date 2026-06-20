import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RefreshToken, User } from "../generated/client";
import { AuthService } from "../services";
import * as UserService from "../services/user.service";
import * as RefreshTokenRepository from "../repos/refresh-token.repository";
import { HashUtils } from "../utils";

vi.mock("../services/user.service", async () => {
    const actual = await vi.importActual("../services/user.service");
    return {
        ...actual,
        get: vi.fn(),
        fetch: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        getPermission: vi.fn(),
    };
});

vi.mock("../repos/refresh-token.repository", async () => {
    // const actual = await vi.importActual("../repos/refresh-token.repository");
    return {
        findOne: vi.fn(),
        create: vi.fn(),
        remove: vi.fn(),
    };
});

const createUser = async (): Promise<User> => {
    const now = new Date();
    return {
        id: 0n,
        insertedAt: now,
        updatedAt: now,
        version: 0,
        email: "vitest@email.com",
        password: await HashUtils.hash("password"),
        active: true,
        roleId: 1n,
    };
};

const createToken = async (user: User): Promise<RefreshToken & { user: User }> => {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return {
        id: 0n,
        insertedAt: now,
        updatedAt: now,
        version: 0,
        token: "fake",
        expiresAt: expiresAt,
        userId: user.id,
        user: user,
    };
};

describe("AuthService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Login", async () => {
        const mockUser = await createUser();
        vi.mocked(UserService.get).mockResolvedValue(mockUser as any);

        const res = await AuthService.login("vitest@email.com", "password");
        expect(res).toBeTypeOf("object");
        expect(res.accessToken).toBeTypeOf("string");
        expect(res.refreshToken).toBeTypeOf("string");
    });

    it("Logout", async () => {
        const res = await AuthService.logout(0n);
        expect(res).toBeTypeOf("undefined");
    });

    it("Refresh", async () => {
        const mockUser = await createUser();
        const mockToken = createToken(mockUser);
        vi.mocked(RefreshTokenRepository.findOne).mockResolvedValue(mockToken as any);
        vi.mocked(RefreshTokenRepository.create).mockResolvedValue(mockToken as any);
        vi.mocked(RefreshTokenRepository.remove).mockResolvedValue(1);

        const res = await AuthService.refresh("fake");
        expect(res).toBeTypeOf("object");
        expect(res.accessToken).toBeTypeOf("string");
        expect(res.refreshToken).toBeTypeOf("string");
    });
});
