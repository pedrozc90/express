import type { Role, User } from "../../generated/client";

export type UserDto = {
    id: string;
    inserted_at: string;
    updated_at: string;
    version: number;
    email: string;
    active: boolean;
    role?: Role;
};

export const toUserDto = (obj: User | null): UserDto | null => {
    if (!obj) return null;
    return {
        id: obj.id.toString(),
        inserted_at: obj.insertedAt.toISOString(),
        updated_at: obj.updatedAt.toISOString(),
        version: obj.version,
        email: obj.email,
        active: obj.active,
        // role: obj.role,
    };
};
