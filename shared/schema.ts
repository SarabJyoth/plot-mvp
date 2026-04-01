import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const parkingLots = sqliteTable("parking_lots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  pricePerHour: integer("price_per_hour").notNull(), // stored in cents
  totalSpots: integer("total_spots").notNull(),
  operatingHoursOpen: text("operating_hours_open").notNull(), // e.g. "08:00"
  operatingHoursClose: text("operating_hours_close").notNull(), // e.g. "22:00"
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const parkingSpots = sqliteTable("parking_spots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lotId: integer("lot_id").notNull().references(() => parkingLots.id),
  spotNumber: text("spot_number").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
});

export const reservations = sqliteTable("reservations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  spotId: integer("spot_id").notNull().references(() => parkingSpots.id),
  lotId: integer("lot_id").notNull().references(() => parkingLots.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed | cancelled
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Insert schemas
export const insertParkingLotSchema = createInsertSchema(parkingLots).omit({
  id: true,
  createdAt: true,
});

export const insertParkingSpotSchema = createInsertSchema(parkingSpots).omit({
  id: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Types
export type ParkingLot = typeof parkingLots.$inferSelect;
export type InsertParkingLot = z.infer<typeof insertParkingLotSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

// Extended types for frontend
export type ParkingLotWithSpots = ParkingLot & {
  availableSpots: number;
  spots?: ParkingSpot[];
};
