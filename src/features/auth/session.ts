import { NextResponse } from "next/server";
import type { PublicUser } from "@/types/api";

const SECRET = process.env.SESSION_SECRET || "default-very-secure-moroccan-recruitment-secret-key-2026";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  issuedAt: number;
};

// Helper: Convert string to Uint8Array
function textToBuffer(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// Helper: Generate an HMAC key from secret
async function getHMACKey(secret: string): Promise<CryptoKey> {
  const secretBuffer = textToBuffer(secret);
  return await crypto.subtle.importKey(
    "raw",
    secretBuffer as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Sign payload using HMAC-SHA256
export async function signSession(payload: SessionPayload): Promise<string> {
  const jsonStr = JSON.stringify(payload);
  
  // Safe Base64 encoding for browser/edge environment
  const base64Payload = btoa(unescape(encodeURIComponent(jsonStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  
  const key = await getHMACKey(SECRET);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    textToBuffer(base64Payload) as BufferSource
  );
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const base64Signature = btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
    
  return `${base64Payload}.${base64Signature}`;
}

// Verify and decode payload
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const [base64Payload, base64Signature] = token.split(".");
    if (!base64Payload || !base64Signature) return null;
    
    const key = await getHMACKey(SECRET);
    
    // Reconstruct signature buffer from base64
    const signatureBinary = atob(base64Signature.replace(/-/g, "+").replace(/_/g, "/"));
    const signatureBuffer = new Uint8Array(signatureBinary.length);
    for (let i = 0; i < signatureBinary.length; i++) {
      signatureBuffer[i] = signatureBinary.charCodeAt(i);
    }
    
    const dataBuffer = textToBuffer(base64Payload);
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer as BufferSource,
      dataBuffer as BufferSource
    );
    
    if (!isValid) return null;
    
    const jsonStr = decodeURIComponent(escape(atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"))));
    return JSON.parse(jsonStr) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSessionResponse(user: PublicUser) {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name || "",
    issuedAt: Date.now(),
  };

  const token = await signSession(payload);

  const response = NextResponse.json({ user });

  response.cookies.set({
    name: "agentic_session",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}
