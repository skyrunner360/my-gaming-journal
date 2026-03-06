import {
	getConnections,
	getSteamFamilyGames,
	getSteamFamilyIDs,
	getSteamOwnedGames,
} from "../connections/actions";
import { getBacklogEntries, getJournalEntries, getWishlists } from "./actions";
import { JournalClient } from "./journal-client";

interface Game {
	appid: number;
	name: string;
	playtime_forever: number;
	img_icon_url: string;
}

export default async function JournalEntriesPage() {
	const connections = await getConnections();
	const steamConnection = connections.find((c) => c.type === "STEAM");

	let steamGames: Game[] = [];
	if (steamConnection) {
		const familySteamIds = await getSteamFamilyIDs();

		const [ownedGames, familyGames] = await Promise.all([
			getSteamOwnedGames(steamConnection.value),
			getSteamFamilyGames(familySteamIds),
		]);

		const allGamesMap = new Map();
		ownedGames.forEach((game: Game) => {
			allGamesMap.set(game.appid, game);
		});
		familyGames.forEach((game) => {
			const steamGame = game as Game;
			if (!allGamesMap.has(steamGame.appid)) {
				allGamesMap.set(steamGame.appid, steamGame);
			}
		});

		steamGames = Array.from(allGamesMap.values()).sort((a, b) =>
			(a.name || "").localeCompare(b.name || ""),
		);
	}

	let journalEntries: {
		id: string;
		content: string;
		gameId: number | null;
		gameName: string | null;
		gameIcon: string | null;
		createdAt: Date;
	}[] = [];
	let backlogEntries: {
		id: string;
		gameId: number;
		gameName: string;
		gameIcon: string | null;
		position: number;
	}[] = [];
	let initialWishlists: {
		id: string;
		title: string;
		createdAt: Date;
		items: {
			id: string;
			gambrainId: number;
			gameName: string;
			gameImage: string | null;
			storeUrl: string | null;
		}[];
	}[] = [];
	let error: string | null = null;

	try {
		[journalEntries, backlogEntries, initialWishlists] = await Promise.all([
			getJournalEntries(),
			getBacklogEntries(),
			getWishlists(),
		]);
	} catch (err) {
		console.error("Failed to fetch data:", err);
		error = "Failed to load journals. Please try again later.";
	}

	return (
		<div className="space-y-6 relative min-h-[calc(100vh-100px)]">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Game Journal</h1>
					<p className="text-muted-foreground">
						Your collection of game reviews, logs, and backlog entries.
					</p>
				</div>
			</div>

			{error ? (
				<div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
					<p className="text-muted-foreground mb-4">{error}</p>
					<p className="text-xs text-muted-foreground/50">
						If this error persists after a page refresh, please try restarting
						the application server.
					</p>
				</div>
			) : (
				<JournalClient
					steamGames={steamGames}
					initialEntries={journalEntries.map((e) => ({
						id: e.id,
						content: e.content,
						gameId: e.gameId,
						gameName: e.gameName,
						gameIcon: e.gameIcon,
						createdAt: e.createdAt.toISOString(),
					}))}
					initialBacklog={backlogEntries}
					initialWishlists={initialWishlists.map((w) => ({
						id: w.id,
						title: w.title,
						createdAt: w.createdAt.toISOString(),
						items: w.items.map((i) => ({
							id: i.id,
							gambrainId: i.gambrainId,
							gameName: i.gameName,
							gameImage: i.gameImage,
							storeUrl: i.storeUrl,
						})),
					}))}
				/>
			)}
		</div>
	);
}
