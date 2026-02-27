"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Must be 32 bytes (64 hex chars)
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // For GCM

function encrypt(text: string): string {
	if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is not set");
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(
		ALGORITHM,
		Buffer.from(ENCRYPTION_KEY, "hex"),
		iv,
	);
	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");
	const authTag = cipher.getAuthTag().toString("hex");
	// Format: iv:authTag:encrypted
	return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

function decrypt(cipherText: string): string {
	if (!ENCRYPTION_KEY) return cipherText; // Safety for missing key
	const parts = cipherText.split(":");
	if (parts.length !== 3) return cipherText; // Return as-is if not encrypted (old hashes)

	const [ivHex, authTagHex, encryptedText] = parts;
	try {
		const iv = Buffer.from(ivHex, "hex");
		const authTag = Buffer.from(authTagHex, "hex");
		const decipher = crypto.createDecipheriv(
			ALGORITHM,
			Buffer.from(ENCRYPTION_KEY, "hex"),
			iv,
		);
		decipher.setAuthTag(authTag);
		let decrypted = decipher.update(encryptedText, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	} catch (error) {
		console.error("Decryption failed:", error);
		return cipherText; // Fallback to original text
	}
}

export async function connectSteam(formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const steamId = formData.get("steamId") as string;
	if (!steamId) {
		throw new Error("Steam ID is required");
	}

	const encryptedValue = encrypt(steamId);

	await prisma.connection.upsert({
		where: {
			userId_type: {
				userId: session.user.id,
				type: "STEAM",
			},
		},
		update: {
			value: encryptedValue,
		},
		create: {
			userId: session.user.id,
			type: "STEAM",
			value: encryptedValue,
		},
	});

	revalidatePath("/dashboard/connections");
	return { success: true };
}

export async function connectPSN(formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const psnToken = formData.get("psnToken") as string;
	if (!psnToken) {
		throw new Error("PSN Token is required");
	}

	const encryptedValue = encrypt(psnToken);

	await prisma.connection.upsert({
		where: {
			userId_type: {
				userId: session.user.id,
				type: "PSN",
			},
		},
		update: {
			value: encryptedValue,
		},
		create: {
			userId: session.user.id,
			type: "PSN",
			value: encryptedValue,
		},
	});

	revalidatePath("/dashboard/connections");
	return { success: true };
}

export async function getConnections() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	const connections = await prisma.connection.findMany({
		where: {
			userId: session.user.id,
		},
	});

	// Decrypt values for the client
	return connections.map((c) => ({
		...c,
		value: decrypt(c.value),
	}));
}
