import type { RefreshToken, User } from "../../generated/client";
import type { RefreshTokenUncheckedCreateInput, RefreshTokenWhereInput } from "../../generated/models";
import { prisma } from "../../infra/database";
import { PrismaUtils } from "../../shared/utils";

export const findOne = async (args: { token: string }): Promise<(RefreshToken & { user: User }) | null> => {
    return prisma.refreshToken.findUnique({
        where: { ...args },
        include: {
            user: true,
        },
    });
};

export const create = async (
    args: Pick<RefreshTokenUncheckedCreateInput, "token" | "userId" | "expiresAt">,
): Promise<RefreshToken> => {
    try {
        return prisma.refreshToken.create({
            data: {
                ...args,
                version: 1,
            },
        });
    } catch (e) {
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};

export const remove = async (
    args: Pick<RefreshTokenWhereInput, "token" | "userId"> | Pick<RefreshTokenWhereInput, "userId">,
): Promise<number> => {
    try {
        return prisma.refreshToken
            .deleteMany({
                where: { ...args },
            })
            .then((res) => res.count);
    } catch (e) {
        const ex = PrismaUtils.map(e);
        throw ex ?? e;
    }
};
