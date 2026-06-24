import request from "supertest";
import app from "../src/app.js";

describe("Menu API", () => {
  describe("GET /api/menu", () => {
    it("should return all available menu items", async () => {
      const res = await request(app).get("/api/menu");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("each menu item should have required fields", async () => {
      const res = await request(app).get("/api/menu");
      const item = res.body.data[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("image_url");
      expect(item).toHaveProperty("category");
    });
  });

  describe("GET /api/menu/:id", () => {
    it("should return a single menu item by id", async () => {
      const res = await request(app).get("/api/menu/1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
    });

    it("should return 404 for non-existent menu item", async () => {
      const res = await request(app).get("/api/menu/99999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).get("/api/menu/abc");
      expect(res.status).toBe(400);
    });
  });
});
