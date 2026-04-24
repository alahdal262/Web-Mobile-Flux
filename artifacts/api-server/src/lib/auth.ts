import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(stored: string, input: string): Promise<boolean> {
  const [salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(input, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hash, "hex");
  return storedBuf.length === derived.length && timingSafeEqual(storedBuf, derived);
}

// In-memory session store (replace with Redis/pg-session for production)
type SessionData = { userId: string; email: string; fullName?: string };
const sessions = new Map<string, SessionData>();

export function createSession(data: SessionData): string {
  const id = randomBytes(32).toString("hex");
  sessions.set(id, data);
  return id;
}

export function getSession(id: string): SessionData | undefined {
  return sessions.get(id);
}

export function deleteSession(id: string): void {
  sessions.delete(id);
}
