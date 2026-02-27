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

export async function getSteamPlayerSummary(steamId: string) {
	const API_KEY = process.env.STEAM_API_KEY;
	if (!API_KEY || API_KEY === "YOUR_STEAM_API_KEY_HERE") {
		return null;
	}

	// Basic check: SteamIDs represent 64-bit integers and are usually 17 digits long.
	if (!/^\d+$/.test(steamId)) {
		console.warn(
			`[Steam] Skipping fetch: ID is not numeric. Re-connection required.`,
		);
		return null;
	}

	try {
		const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;
		const response = await fetch(url, { cache: "no-store" });

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.response.players?.[0] || null;
	} catch (error) {
		console.error("[Steam] Fetch Exception:", error);
		return null;
	}
}

export async function getSteamLevel(steamId: string) {
	const API_KEY = process.env.STEAM_API_KEY;
	if (!API_KEY || API_KEY === "YOUR_STEAM_API_KEY_HERE") {
		return null;
	}

	try {
		const response = await fetch(
			`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${steamId}`,
		);
		const data = await response.json();
		return data.response.player_level || null;
	} catch (error) {
		console.error("Failed to fetch Steam level:", error);
		return null;
	}
}

export async function getSteamOwnedGames(steamId: string) {
	const API_KEY = process.env.STEAM_API_KEY;
	if (!API_KEY || API_KEY === "YOUR_STEAM_API_KEY_HERE") {
		return [];
	}

	try {
		const response = await fetch(
			`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return [];
		}

		const data = await response.json();
		return data.response.games || [];
	} catch (error) {
		console.error("Failed to fetch Steam owned games:", error);
		return [];
	}
}

export async function getSteamFamilyGames(familySteamIds: string[]) {
	if (familySteamIds.length === 0) return [];

	try {
        const gamesPromises = familySteamIds.map(id => getSteamOwnedGames(id));
        const gamesResults = await Promise.all(gamesPromises);
        
        // Flatten and add a flag
        return gamesResults.flat().map(game => ({
            ...game,
            is_family_shared: true
        }));
	} catch (error) {
		console.error("Failed to fetch Steam family games:", error);
		return [];
	}
}

export async function getSteamFamilyIDs() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	const connection = await prisma.connection.findUnique({
		where: {
			userId_type: {
				userId: session.user.id,
				type: "STEAM_FAMILY",
			},
		},
	});

	if (!connection) return [];
    
    // Store as comma-separated in 'value'
	return connection.value.split(",").map(id => id.trim()).filter(Boolean);
}

export async function updateSteamFamilyIDs(ids: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const existingIds = await getSteamFamilyIDs();
	const newIds = ids.split(",").map(id => id.trim()).filter(Boolean);
	
	// Merge and limit to 3
	const combinedIds = Array.from(new Set([...existingIds, ...newIds])).slice(0, 3);
	const value = combinedIds.join(",");

	await prisma.connection.upsert({
		where: {
			userId_type: {
				userId: session.user.id,
				type: "STEAM_FAMILY",
			},
		},
		update: {
			value,
		},
		create: {
			userId: session.user.id,
			type: "STEAM_FAMILY",
			value,
		},
	});

	revalidatePath("/dashboard/connections");
	revalidatePath("/dashboard/journal");
	return { success: true };
}

export async function removeSteamFamilyMember(steamId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const existingIds = await getSteamFamilyIDs();
	const filteredIds = existingIds.filter(id => id !== steamId);

	if (filteredIds.length === 0) {
		await prisma.connection.delete({
			where: {
				userId_type: {
					userId: session.user.id,
					type: "STEAM_FAMILY",
				},
			},
		});
	} else {
		await prisma.connection.update({
			where: {
				userId_type: {
					userId: session.user.id,
					type: "STEAM_FAMILY",
				},
			},
			data: {
				value: filteredIds.join(","),
			},
		});
	}

	revalidatePath("/dashboard/connections");
	revalidatePath("/dashboard/journal");
	return { success: true };
}

export async function disconnectConnection(type: "STEAM" | "PSN") {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	await prisma.connection.delete({
		where: {
			userId_type: {
				userId: session.user.id,
				type,
			},
		},
	});

	revalidatePath("/dashboard/connections");
	revalidatePath("/dashboard");
	return { success: true };
}
