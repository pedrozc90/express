export const PERMISSIONS = ["admin", "user:read", "user:write", "file:read", "file:write", "role:read", "role:write"];

export type PermissionTag = (typeof PERMISSIONS)[number];

export const isPermission = (value: string): value is PermissionTag => {
    return (PERMISSIONS as readonly string[]).includes(value);
};

export const PermissionMask: Record<PermissionTag, bigint> = {
    admin: 1n,
    "user:read": 2n,
    "user:write": 4n,
    "file:read": 8n,
    "file:write": 16n,
    "role:read": 32n,
    "role:write": 64n,
} as const;
