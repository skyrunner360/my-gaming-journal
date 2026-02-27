import { getConnections, getSteamOwnedGames, getSteamFamilyGames, getSteamFamilyIDs } from "../connections/actions";
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
		// Fetch family IDs from the specific connection type
		const familySteamIds = await getSteamFamilyIDs();

		const [ownedGames, familyGames] = await Promise.all([
			getSteamOwnedGames(steamConnection.value),
			getSteamFamilyGames(familySteamIds),
		]);

		// Merge and deduplicate by appid
		const allGamesMap = new Map();

		// Add owned games first
		ownedGames.forEach((game: Game) => allGamesMap.set(game.appid, game));

		// Add family games if not already present
		familyGames.forEach((game: any) => {
			if (!allGamesMap.has(game.appid)) {
				allGamesMap.set(game.appid, game);
			}
		});

		steamGames = Array.from(allGamesMap.values()).sort((a, b) =>
			(a.name || "").localeCompare(b.name || "")
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Game Journal</h1>
				<p className="text-muted-foreground">
					Your collection of game reviews, logs, and backlog entries.
				</p>
			</div>

			<JournalClient steamGames={steamGames} psnGames={[]} />
		</div>
	);
}
