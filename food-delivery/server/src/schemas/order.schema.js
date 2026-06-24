import { z } from "zod";

const orderItemSchema = z.object({
  menu_item_id: z.number().int().positive("menu_item_id must be a positive integer"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20, "Quantity cannot exceed 20"),
});

const createOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long")
    .trim(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number format"),
  items: z
    .array(orderItemSchema)
    .min(1, "Order must have at least one item")
    .max(20, "Too many items in one order"),
});

const updateStatusSchema = z.object({
  status: z.enum(
    ["received", "preparing", "out_for_delivery", "delivered", "cancelled"],
    { errorMap: () => ({ message: "Invalid order status" }) }
  ),
});

export { createOrderSchema, updateStatusSchema };
