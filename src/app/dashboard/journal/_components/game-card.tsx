"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Game {
	appid: number;
	name: string;
	playtime_forever: number;
	img_icon_url: string;
	is_family_shared?: boolean;
}

interface GameCardProps {
	game: Game;
	journalCount?: number;
	onClick?: (game: Game) => void;
}

export function GameCard({ game, journalCount = 0, onClick }: GameCardProps) {
	return (
		<Card
			className={`overflow-hidden py-0 group hover:border-primary/50 transition-all relative ${journalCount > 0 ? "cursor-pointer active:scale-[0.98]" : ""
				}`}
			onClick={() => journalCount > 0 && onClick?.(game)}
		>
			{game.is_family_shared && (
				<div className="absolute top-2 right-2 z-10 bg-blue-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
					Family
				</div>
			)}
			{journalCount > 0 && (
				<div className="absolute top-2 left-2 z-10 bg-primary text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
					{journalCount} {journalCount === 1 ? "Entry" : "Entries"}
				</div>
			)}
			<div className="aspect-[16/9] relative overflow-hidden bg-muted">
				<img
					src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
					alt={game.name}
					className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							"https://placehold.co/400x225?text=No+Header+Image";
					}}
				/>
			</div>
			<CardHeader className="p-2 space-y-1">
				<CardTitle className="text-xs line-clamp-1 h-4">{game.name}</CardTitle>
				<Button
					variant="ghost"
					size="sm"
					className="w-full h-6 text-[9px] justify-between px-2 hover:bg-[#1b2838] hover:text-white"
					asChild
				>
					<a
						href={`https://store.steampowered.com/app/${game.appid}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						Steam Page <ExternalLink className="h-3 w-3" />
					</a>
				</Button>
			</CardHeader>
		</Card>
	);
}
