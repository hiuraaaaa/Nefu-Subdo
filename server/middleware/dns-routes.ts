import { Express } from "express";
import dnsRouter from "../routes/dns";

export function setupDNSRoutes(app: Express) {
  app.use("/api", dnsRouter);
}
