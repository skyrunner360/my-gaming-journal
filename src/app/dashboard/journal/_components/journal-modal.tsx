"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Game {
	appid: number;
	name: string;
	img_icon_url: string;
}

interface JournalModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: {
		content: string;
		gameId?: number;
		gameName?: string;
		gameIcon?: string;
	}) => Promise<void>;
	games: Game[];
	initialData?: {
		content: string;
		gameId?: number | null;
	};
}

export function JournalModal({
	isOpen,
	onClose,
	onSave,
	games,
	initialData,
}: JournalModalProps) {
	const [content, setContent] = useState("");
	const [selectedGameId, setSelectedGameId] = useState<string>("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setContent(initialData?.content || "");
			setSelectedGameId(initialData?.gameId?.toString() || "");
		}
	}, [isOpen, initialData]);

	const handleSave = async () => {
		if (!content.trim()) return;

		setIsSaving(true);
		try {
			const selectedGame = games.find(
				(g) => g.appid.toString() === selectedGameId,
			);
			await onSave({
				content,
				gameId: selectedGame?.appid,
				gameName: selectedGame?.name,
				gameIcon: selectedGame?.img_icon_url,
			});
			setContent("");
			setSelectedGameId("");
			onClose();
		} catch (error) {
			console.error("Failed to save journal entry:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Edit Journal Entry" : "New Journal Entry"}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="game">Associated Game (Optional)</Label>
						<Select value={selectedGameId} onValueChange={setSelectedGameId}>
							<SelectTrigger id="game" className="w-full">
								<SelectValue placeholder="Select a game" />
							</SelectTrigger>
							<SelectContent>
								{games.map((game) => (
									<SelectItem key={game.appid} value={game.appid.toString()}>
										<div className="flex items-center gap-2">
											<img
												src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
												alt=""
												className="h-4 w-8 object-cover rounded"
												onError={(e) => {
													(e.target as HTMLImageElement).src =
														"https://placehold.co/32x18?text=G";
												}}
											/>
											<span className="truncate">{game.name}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="content">Journal Note</Label>
						<Textarea
							id="content"
							placeholder="What's on your mind? Achievements, thoughts, or progress..."
							className="min-h-[300px] resize-none text-base leading-relaxed"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || !content.trim()}
						className="bg-[#003087] hover:bg-[#003bb0] text-white px-8"
					>
						{isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
						{initialData ? "Update Entry" : "Save Entry"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
