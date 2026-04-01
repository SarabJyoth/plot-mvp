import {
  type ParkingLot,
  type InsertParkingLot,
  type ParkingSpot,
  type InsertParkingSpot,
  type Reservation,
  type InsertReservation,
  type ParkingLotWithSpots,
  parkingLots,
  parkingSpots,
  reservations,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  // Lots
  getAllLots(): ParkingLotWithSpots[];
  getLotById(id: number): ParkingLotWithSpots | undefined;
  createLot(lot: InsertParkingLot): ParkingLot;

  // Spots
  getSpotsByLotId(lotId: number): ParkingSpot[];
  getSpotById(id: number): ParkingSpot | undefined;
  createSpot(spot: InsertParkingSpot): ParkingSpot;

  // Reservations
  createReservation(reservation: InsertReservation): Reservation;
  getReservationsByEmail(email: string): Reservation[];
  getReservationById(id: number): Reservation | undefined;
  cancelReservation(id: number): Reservation | undefined;
}

export class DatabaseStorage implements IStorage {
  getAllLots(): ParkingLotWithSpots[] {
    const lots = db.select().from(parkingLots).all();
    return lots.map((lot) => {
      const spots = db
        .select()
        .from(parkingSpots)
        .where(eq(parkingSpots.lotId, lot.id))
        .all();
      const availableSpots = spots.filter((s) => s.isAvailable).length;
      return { ...lot, availableSpots };
    });
  }

  getLotById(id: number): ParkingLotWithSpots | undefined {
    const lot = db
      .select()
      .from(parkingLots)
      .where(eq(parkingLots.id, id))
      .get();
    if (!lot) return undefined;
    const spots = db
      .select()
      .from(parkingSpots)
      .where(eq(parkingSpots.lotId, id))
      .all();
    const availableSpots = spots.filter((s) => s.isAvailable).length;
    return { ...lot, availableSpots, spots };
  }

  createLot(lot: InsertParkingLot): ParkingLot {
    return db.insert(parkingLots).values(lot).returning().get();
  }

  getSpotsByLotId(lotId: number): ParkingSpot[] {
    return db
      .select()
      .from(parkingSpots)
      .where(eq(parkingSpots.lotId, lotId))
      .all();
  }

  getSpotById(id: number): ParkingSpot | undefined {
    return db
      .select()
      .from(parkingSpots)
      .where(eq(parkingSpots.id, id))
      .get();
  }

  createSpot(spot: InsertParkingSpot): ParkingSpot {
    return db.insert(parkingSpots).values(spot).returning().get();
  }

  createReservation(reservation: InsertReservation): Reservation {
    return db.insert(reservations).values(reservation).returning().get();
  }

  getReservationsByEmail(email: string): Reservation[] {
    return db
      .select()
      .from(reservations)
      .where(eq(reservations.guestEmail, email))
      .all();
  }

  getReservationById(id: number): Reservation | undefined {
    return db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .get();
  }

  cancelReservation(id: number): Reservation | undefined {
    return db
      .update(reservations)
      .set({ status: "cancelled" })
      .where(eq(reservations.id, id))
      .returning()
      .get();
  }
}

export const storage = new DatabaseStorage();
