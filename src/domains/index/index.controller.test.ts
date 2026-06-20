import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Index Controller", () => {
    it("GET /", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(302);
    });

    it("GET /health", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("version");
    });

    it("GET /ready", async () => {
        const res = await request(app).get("/ready");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("status");
    });
});
