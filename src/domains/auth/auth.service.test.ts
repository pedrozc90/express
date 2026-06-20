import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RefreshToken, User } from "../../generated/client";
import { AuthService, RefreshTokenRepository } from "../../domains/auth";
import { UserService } from "../../domains/user";
import { HashUtils } from "../../shared/utils";

vi.mock("../user/user.service", async () => {
    const actual = await vi.importActual<typeof import("../user/user.service")>("../user/user.service");
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

vi.mock("./refresh-token.repository", () => {
    return {
        findOne: vi.fn(),
        create: vi.fn(),
        remove: vi.fn(),
    };
});

const createUser = async (): Promise<User> => {
    const now = new Date();
    return {
        id: 1n,
        insertedAt: now,
        updatedAt: now,
        version: 1,
        email: "vitest@email.com",
        password: await HashUtils.hash("password"),
        active: true,
        roleId: 1n,
    };
};

const createToken = (user: User): RefreshToken & { user: User } => {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return {
        id: 1n,
        insertedAt: now,
        updatedAt: now,
        version: 1,
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
        vi.mocked(RefreshTokenRepository.create).mockResolvedValue(createToken(mockUser));

        const res = await AuthService.login("vitest@email.com", "password");
        expect(res).toBeTypeOf("object");
        expect(res.accessToken).toBeTypeOf("string");
        expect(res.refreshToken).toBeTypeOf("string");
    });

    it("Login - inactive user", async () => {
        const mockUser = await createUser();
        vi.mocked(UserService.get).mockResolvedValue({ ...mockUser, active: false } as any);

        await expect(AuthService.login("vitest@email.com", "password")).rejects.toMatchObject({
            message: "Account is inactive",
        });
    });

    it("Logout", async () => {
        vi.mocked(RefreshTokenRepository.remove).mockResolvedValue(1);
        const res = await AuthService.logout(0n);
        expect(res).toBeTypeOf("undefined");
    });

    it("Refresh", async () => {
        const mockUser = await createUser();
        const mockToken = createToken(mockUser);
        vi.mocked(RefreshTokenRepository.findOne).mockResolvedValue(mockToken);
        vi.mocked(RefreshTokenRepository.create).mockResolvedValue(mockToken);
        vi.mocked(RefreshTokenRepository.remove).mockResolvedValue(1);

        const res = await AuthService.refresh("fake");
        expect(res).toBeTypeOf("object");
        expect(res.accessToken).toBeTypeOf("string");
        expect(res.refreshToken).toBeTypeOf("string");
    });
});
