import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
        env: {
            NODE_ENV: "test",
            HASHING_SALT: "10",
            HASHING_PEPPER: "vitest",
            CORS_ENABLED: "false",
            JWT_SECRET: "vitest",
            JWT_ISSUER: "vitest",
            JWT_EXPIRES_IN: "10m",
            DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/express?schema=public",
        },
    },
});
