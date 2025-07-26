import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cryptoData = pgTable("crypto_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().default("GERM"),
  price: real("price").notNull(),
  marketCap: real("market_cap").notNull(),
  volume24h: real("volume_24h").notNull(),
  holders: integer("holders").notNull(),
  change24h: real("change_24h").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});



export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCryptoDataSchema = createInsertSchema(cryptoData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CryptoData = typeof cryptoData.$inferSelect;
export type InsertCryptoData = z.infer<typeof insertCryptoDataSchema>;
