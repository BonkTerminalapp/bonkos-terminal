import { users, cryptoData, type User, type InsertUser, type CryptoData, type InsertCryptoData } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCryptoData(): Promise<CryptoData | undefined>;
  updateCryptoData(data: Partial<CryptoData>): Promise<CryptoData>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCryptoData(): Promise<CryptoData | undefined> {
    const [data] = await db.select().from(cryptoData).limit(1);
    if (!data) {
      // Initialize with default data if none exists
      const [newData] = await db
        .insert(cryptoData)
        .values({
          symbol: "GERM",
          price: 0.001,
          marketCap: 1000000,
          volume24h: 50000,
          holders: 0, // Keep field for database compatibility but set to 0
          change24h: 0,
        })
        .returning();
      return newData;
    }
    return data;
  }

  async updateCryptoData(data: Partial<CryptoData>): Promise<CryptoData> {
    const existing = await this.getCryptoData();
    if (!existing) {
      throw new Error("No crypto data to update");
    }
    
    const [updated] = await db
      .update(cryptoData)
      .set(data)
      .where(eq(cryptoData.id, existing.id))
      .returning();
    return updated;
  }


}

export const storage = new DatabaseStorage();
