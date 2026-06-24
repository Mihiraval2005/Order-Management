import request from "supertest";
import app from "../src/app.js";

const validOrder = {
  customer_name: "Mihir Shah",
  address: "123 SG Highway, Ahmedabad, Gujarat 380054",
  phone: "9876543210",
  items: [{ menu_item_id: 1, quantity: 2 }],
};

describe("Order API", () => {
  let createdOrderId;

  describe("POST /api/orders", () => {
    it("should create a new order with valid data", async () => {
      const res = await request(app).post("/api/orders").send(validOrder);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.customer_name).toBe(validOrder.customer_name);
      expect(res.body.data.status).toBe("received");
      createdOrderId = res.body.data.id;
    });

    it("should return 400 if customer_name is missing", async () => {
      const { customer_name, ...rest } = validOrder;
      const res = await request(app).post("/api/orders").send(rest);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === "customer_name")).toBe(true);
    });

    it("should return 400 if items array is empty", async () => {
      const res = await request(app).post("/api/orders").send({ ...validOrder, items: [] });
      expect(res.status).toBe(400);
    });

    it("should return 400 if phone number is invalid", async () => {
      const res = await request(app).post("/api/orders").send({ ...validOrder, phone: "abc" });
      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.field === "phone")).toBe(true);
    });

    it("should return 400 if quantity is less than 1", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({ ...validOrder, items: [{ menu_item_id: 1, quantity: 0 }] });
      expect(res.status).toBe(400);
    });

    it("should return 400 if menu_item_id does not exist", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({ ...validOrder, items: [{ menu_item_id: 99999, quantity: 1 }] });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders", () => {
    it("should return a list of all orders", async () => {
      const res = await request(app).get("/api/orders");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return a single order by id", async () => {
      const res = await request(app).get(`/api/orders/${createdOrderId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdOrderId);
      expect(Array.isArray(res.body.data.orderItems)).toBe(true);
    });

    it("should return 404 for non-existent order", async () => {
      const res = await request(app).get("/api/orders/99999");
      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/orders/:id/status", () => {
    it("should update order status to 'preparing'", async () => {
      const res = await request(app)
        .patch(`/api/orders/${createdOrderId}/status`)
        .send({ status: "preparing" });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("preparing");
    });

    it("should return 400 for invalid status value", async () => {
      const res = await request(app)
        .patch(`/api/orders/${createdOrderId}/status`)
        .send({ status: "flying" });
      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent order", async () => {
      const res = await request(app)
        .patch("/api/orders/99999/status")
        .send({ status: "preparing" });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    it("should cancel an order in 'received' status", async () => {
      const orderRes = await request(app).post("/api/orders").send(validOrder);
      const newId = orderRes.body.data.id;
      const res = await request(app).delete(`/api/orders/${newId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("cancelled");
    });

    it("should return 400 when cancelling a non-received order", async () => {
      const res = await request(app).delete(`/api/orders/${createdOrderId}`);
      expect(res.status).toBe(400);
    });
  });
});
