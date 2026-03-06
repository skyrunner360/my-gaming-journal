"use client";

import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JournalPlusCard } from "./journal-plus-card";

interface JournalEntry {
	id: string;
	content: string;
	gameId?: number | null;
	gameName?: string | null;
	gameIcon?: string | null;
	createdAt: Date;
}

interface RawJournalTabProps {
	entries: JournalEntry[];
	onAddNew: () => void;
	onEdit: (entry: JournalEntry) => void;
	onDelete: (id: string) => Promise<void>;
}

export function RawJournalTab({
	entries,
	onAddNew,
	onEdit,
	onDelete,
}: RawJournalTabProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-24">
			<JournalPlusCard onClick={onAddNew} />

			{entries.map((entry) => (
				<Card
					key={entry.id}
					className="flex flex-col h-full hover:border-primary/50 cursor-pointer transition-all active:scale-[0.98]"
					onClick={() => onEdit(entry)}
				>
					<CardHeader className="p-4 pb-2">
						<div className="flex justify-between items-start gap-2">
							<div className="space-y-1 min-w-0">
								{entry.gameName ? (
									<div className="flex items-center gap-1.5">
										<img
											src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${entry.gameId}/header.jpg`}
											alt=""
											className="h-3 w-6 object-cover rounded"
											onError={(e) => {
												(e.target as HTMLImageElement).src =
													"https://placehold.co/32x18?text=G";
											}}
										/>
										<span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
											{entry.gameName}
										</span>
									</div>
								) : (
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										General Note
									</span>
								)}
								<p className="text-[10px] text-muted-foreground">
									{formatDistanceToNow(new Date(entry.createdAt), {
										addSuffix: true,
									})}
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
								onClick={(e) => {
									e.stopPropagation();
									if (
										window.confirm(
											"Are you sure you want to delete this journal entry?",
										)
									) {
										onDelete(entry.id);
									}
								}}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-4 pt-2 flex-1">
						<p className="text-sm whitespace-pre-wrap line-clamp-6 leading-relaxed">
							{entry.content}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
