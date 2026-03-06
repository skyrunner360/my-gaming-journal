"use client";

import { Gamepad2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { GameCard } from "./game-card";
import { GameSearchBar } from "./game-search-bar";

interface Game {
	appid: number;
	name: string;
	playtime_forever: number;
	img_icon_url: string;
	is_family_shared?: boolean;
}

interface JournalEntry {
	gameId?: number | null;
}

interface LibraryTabProps {
	steamGames: Game[];
	entries: JournalEntry[];
	onGameSelect: (game: Game) => void;
}

export function LibraryTab({
	steamGames,
	entries,
	onGameSelect,
}: LibraryTabProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const filteredSteamGames = steamGames.filter((game) =>
		(game.name || "")
			.toLowerCase()
			.includes(debouncedSearchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-4 py-2">
				<GameSearchBar value={searchQuery} onChange={setSearchQuery} />
				<div className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-md border text-xs font-medium shrink-0">
					<Gamepad2 className="h-4 w-4 text-primary" />
					<span>{filteredSteamGames.length} Games</span>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Steam Section */}
				<div className="flex-1 flex flex-col min-w-0">
					<div className="flex items-center gap-2 border-b pb-2 mb-4 shrink-0">
						<Gamepad2 className="h-5 w-5 text-[#003087]" />
						<h3 className="font-semibold text-lg">Steam Library</h3>
					</div>

					<div className="pr-4">
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 pb-8">
							{filteredSteamGames.map((game) => {
								const journalCount = entries.filter(
									(e) => e.gameId === game.appid,
								).length;
								return (
									<GameCard
										key={game.appid}
										game={game}
										journalCount={journalCount}
										onClick={onGameSelect}
									/>
								);
							})}

							{filteredSteamGames.length === 0 && (
								<div className="col-span-full py-12 text-center bg-muted/30 rounded-lg border border-dashed">
									<Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
									<p className="text-sm text-muted-foreground">
										{searchQuery
											? `No games matching "${searchQuery}"`
											: "No Steam games found."}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* PSN Section */}
				<div className="flex-1 flex flex-col min-w-0">
					<div className="flex items-center gap-2 border-b pb-2 mb-4 shrink-0">
						<Gamepad2 className="h-5 w-5 text-[#003087]" />
						<h3 className="font-semibold text-lg">PSN Library</h3>
					</div>
					<div className="pr-4">
						<div className="py-8 text-center bg-muted/50 rounded-lg border border-dashed">
							<p className="text-sm text-muted-foreground">
								PSN library sync coming soon.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
