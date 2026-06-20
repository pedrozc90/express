import type { Role } from "../../generated/client";

export type RoleDto = {
    id: string;
    name: string;
};

export const toRoleDto = (role: Role) => {
    return {
        id: role.id.toString(),
        name: role.name,
    };
};
