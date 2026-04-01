import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertParkingLotSchema, insertReservationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/lots — list all lots with available spot counts
  app.get("/api/lots", (_req, res) => {
    const lots = storage.getAllLots();
    res.json(lots);
  });

  // GET /api/lots/:id — get a single lot with its spots
  app.get("/api/lots/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lot ID" });
    }
    const lot = storage.getLotById(id);
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }
    res.json(lot);
  });

  // POST /api/lots — create a new lot (also creates N spots)
  app.post("/api/lots", (req, res) => {
    const parsed = insertParkingLotSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid lot data", errors: parsed.error.flatten() });
    }

    const lot = storage.createLot(parsed.data);

    // Create individual spots
    const totalSpots = parsed.data.totalSpots;
    for (let i = 1; i <= totalSpots; i++) {
      storage.createSpot({
        lotId: lot.id,
        spotNumber: `${i}`,
        isAvailable: true,
      });
    }

    const lotWithSpots = storage.getLotById(lot.id);
    res.status(201).json(lotWithSpots);
  });

  // GET /api/spots/:lotId — get spots for a lot
  app.get("/api/spots/:lotId", (req, res) => {
    const lotId = parseInt(req.params.lotId, 10);
    if (isNaN(lotId)) {
      return res.status(400).json({ message: "Invalid lot ID" });
    }
    const spots = storage.getSpotsByLotId(lotId);
    res.json(spots);
  });

  // POST /api/reservations — create a reservation
  app.post("/api/reservations", (req, res) => {
    const parsed = insertReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid reservation data", errors: parsed.error.flatten() });
    }

    // Verify spot exists and is available
    const spot = storage.getSpotById(parsed.data.spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    if (!spot.isAvailable) {
      return res.status(409).json({ message: "Spot is not available" });
    }

    const reservation = storage.createReservation(parsed.data);
    res.status(201).json(reservation);
  });

  // GET /api/reservations?email=X — get reservations by email
  app.get("/api/reservations", (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }
    const userReservations = storage.getReservationsByEmail(email);

    // Enrich with lot info
    const enriched = userReservations.map((r) => {
      const lot = storage.getLotById(r.lotId);
      const spot = storage.getSpotById(r.spotId);
      return {
        ...r,
        lotName: lot?.name ?? "Unknown",
        lotAddress: lot?.address ?? "Unknown",
        spotNumber: spot?.spotNumber ?? "Unknown",
      };
    });

    res.json(enriched);
  });

  // PATCH /api/reservations/:id/cancel — cancel a reservation
  app.patch("/api/reservations/:id/cancel", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }

    const existing = storage.getReservationById(id);
    if (!existing) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    if (existing.status === "cancelled") {
      return res.status(409).json({ message: "Reservation is already cancelled" });
    }

    const updated = storage.cancelReservation(id);
    res.json(updated);
  });

  return httpServer;
}
