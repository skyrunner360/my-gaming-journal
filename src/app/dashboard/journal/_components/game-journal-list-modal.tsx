"use client";

import { formatDistanceToNow } from "date-fns";
import { Trash2, Clock, Gamepad2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface JournalEntry {
    id: string;
    content: string;
    gameId?: number | null;
    gameName?: string | null;
    gameIcon?: string | null;
    createdAt: Date;
}

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
}

interface GameJournalListModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    entries: JournalEntry[];
    onEditEntry: (entry: JournalEntry) => void;
    onDeleteEntry: (id: string) => Promise<void>;
}

export function GameJournalListModal({
    isOpen,
    onClose,
    game,
    entries,
    onEditEntry,
    onDeleteEntry,
}: GameJournalListModalProps) {
    if (!game) return null;

    const formatPlaytime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border-none bg-background rounded-xl shadow-2xl">
                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* Left Side: Journal List */}
                    <div className="flex-1 flex flex-col min-w-0 bg-background">
                        <DialogHeader className="p-6 pb-2 shrink-0">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Gamepad2 className="h-6 w-6 text-primary" />
                                    Journal Entries
                                </DialogTitle>
                            </div>
                        </DialogHeader>

                        <ScrollArea className="flex-1 p-6 pt-2">
                            <div className="space-y-4">
                                {entries.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-lg">
                                        No entries for this game yet.
                                    </div>
                                ) : (
                                    entries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="group relative bg-muted/30 hover:bg-muted/50 rounded-lg p-4 transition-all cursor-pointer border border-transparent hover:border-primary/20"
                                            onClick={() => onEditEntry(entry)}
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                                                    {formatDistanceToNow(new Date(entry.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                            window.confirm(
                                                                "Are you sure you want to delete this journal entry?",
                                                            )
                                                        ) {
                                                            onDeleteEntry(entry.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-foreground/90 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                                                {entry.content}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Side: Game Info & Stats */}
                    <div className="w-full md:w-[320px] bg-muted/20 border-l flex flex-col shrink-0">
                        <div className="relative aspect-[16/9] w-full shrink-0">
                            <img
                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                alt={game.name}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "https://placehold.co/600x338?text=No+Header";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                                    {game.name}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 bg-background/50 p-3 rounded-lg border border-primary/10 shadow-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            Playtime
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {formatPlaytime(game.playtime_forever)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-background/50 p-3 rounded-lg border border-primary/10 shadow-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Gamepad2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="text-sm font-semibold capitalize">
                                            In Library
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                    Quick Stats
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-background/40 p-2 rounded border text-center">
                                        <p className="text-[10px] text-muted-foreground">Entries</p>
                                        <p className="text-base font-bold text-primary">
                                            {entries.length}
                                        </p>
                                    </div>
                                    <div className="bg-background/40 p-2 rounded border text-center opacity-50">
                                        <p className="text-[10px] text-muted-foreground">Shared</p>
                                        <p className="text-base font-bold">N/A</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-muted/40 mt-auto">
                            <Button
                                variant="outline"
                                className="w-full h-10 font-medium"
                                onClick={onClose}
                            >
                                Close View
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Custom Close Button for the Dialog */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none hover:bg-muted bg-background/50 backdrop-blur-sm z-50 md:hidden"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogContent>
        </Dialog>
    );
}
