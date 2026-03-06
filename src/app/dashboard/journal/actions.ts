"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createJournalEntry(data: {
	content: string;
	gameId?: number;
	gameName?: string;
	gameIcon?: string;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const entry = await prisma.journalEntry.create({
		data: {
			userId: session.user.id,
			content: data.content,
			gameId: data.gameId,
			gameName: data.gameName,
			gameIcon: data.gameIcon,
		},
	});

	revalidatePath("/dashboard/journal");
	return entry;
}

export async function getJournalEntries() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	// Safety check for generated client
	if (!prisma.journalEntry) {
		console.error(
			"Prisma client does not have 'journalEntry' property. Ensure you have run 'npx prisma generate'.",
		);
		return [];
	}

	const entries = await prisma.journalEntry.findMany({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return entries;
}

export async function updateJournalEntry(
	id: string,
	data: {
		content: string;
		gameId?: number;
		gameName?: string;
		gameIcon?: string;
	},
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const entry = await prisma.journalEntry.update({
		where: {
			id,
			userId: session.user.id,
		},
		data: {
			content: data.content,
			gameId: data.gameId,
			gameName: data.gameName,
			gameIcon: data.gameIcon,
		},
	});

	revalidatePath("/dashboard/journal");
	return entry;
}

export async function deleteJournalEntry(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	await prisma.journalEntry.delete({
		where: {
			id,
			userId: session.user.id,
		},
	});

	revalidatePath("/dashboard/journal");
	return { success: true };
}

// ─── Backlog Actions ─────────────────────────────────────────

export async function createBacklogEntry(data: {
	gameId: number;
	gameName: string;
	gameIcon?: string;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	// Get the max position for this user's backlog
	const maxPos = await prisma.backlogEntry.aggregate({
		where: { userId: session.user.id },
		_max: { position: true },
	});

	const entry = await prisma.backlogEntry.create({
		data: {
			userId: session.user.id,
			gameId: data.gameId,
			gameName: data.gameName,
			gameIcon: data.gameIcon,
			position: (maxPos._max.position ?? -1) + 1,
		},
	});

	revalidatePath("/dashboard/journal");
	return entry;
}

export async function getBacklogEntries() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	if (!prisma.backlogEntry) {
		console.error(
			"Prisma client does not have 'backlogEntry' property. Ensure you have run 'npx prisma generate'.",
		);
		return [];
	}

	const entries = await prisma.backlogEntry.findMany({
		where: { userId: session.user.id },
		orderBy: { position: "asc" },
	});

	return entries;
}

export async function updateBacklogPositions(
	items: { id: string; position: number }[],
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	await prisma.$transaction(
		items.map((item) =>
			prisma.backlogEntry.update({
				where: { id: item.id, userId: session.user.id },
				data: { position: item.position },
			}),
		),
	);

	revalidatePath("/dashboard/journal");
	return { success: true };
}

export async function deleteBacklogEntry(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	await prisma.backlogEntry.delete({
		where: { id, userId: session.user.id },
	});

	revalidatePath("/dashboard/journal");
	return { success: true };
}

// ─── Wishlist Actions ────────────────────────────────────────

export async function searchGames(query: string) {
	if (!query.trim()) return [];

	const res = await fetch(
		`https://api.gamebrain.co/v1/games/suggestions?query=${encodeURIComponent(query)}&limit=8`,
		{
			headers: {
				Authorization: `Bearer ${process.env.GAMEBRAIN_API_KEY}`,
			},
		},
	);

	if (!res.ok) {
		console.error("Gamebrain API error:", res.status);
		return [];
	}

	const data = await res.json();
	const results = data.results || [];

	return results.map(
		(game: {
			id: number;
			name: string;
			image?: string;
			link?: string;
			year?: number;
			genre?: string;
		}) => ({
			id: game.id,
			name: game.name,
			image: game.image,
			url: game.link,
			released: game.year ? String(game.year) : undefined,
		}),
	);
}

export async function createWishlist(
	title: string,
	items: {
		gambrainId: number;
		gameName: string;
		gameImage?: string;
		storeUrl?: string;
	}[],
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const wishlist = await prisma.wishlist.create({
		data: {
			userId: session.user.id,
			title,
			items: {
				create: items.map((item) => ({
					gambrainId: item.gambrainId,
					gameName: item.gameName,
					gameImage: item.gameImage,
					storeUrl: item.storeUrl,
				})),
			},
		},
		include: {
			items: true,
		},
	});

	revalidatePath("/dashboard/journal");
	return wishlist;
}

export async function getWishlists() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return [];
	}

	if (!prisma.wishlist) {
		console.error(
			"Prisma client does not have 'wishlist' property. Ensure you have run 'npx prisma generate'.",
		);
		return [];
	}

	const wishlists = await prisma.wishlist.findMany({
		where: { userId: session.user.id },
		include: {
			items: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return wishlists;
}

export async function deleteWishlist(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	await prisma.wishlist.delete({
		where: { id, userId: session.user.id },
	});

	revalidatePath("/dashboard/journal");
	return { success: true };
}
