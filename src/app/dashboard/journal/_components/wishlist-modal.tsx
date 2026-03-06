"use client";

import { Loader2, Search, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GameResult {
    id: number;
    name: string;
    image?: string;
    url?: string;
    released?: string;
    platforms?: string[];
}

interface WishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string, games: {
        gambrainId: number;
        gameName: string;
        gameImage?: string;
        storeUrl?: string;
    }[]) => Promise<void>;
    onSearch: (query: string) => Promise<GameResult[]>;
}

export function WishlistModal({
    isOpen,
    onClose,
    onAdd,
    onSearch,
}: WishlistModalProps) {
    const [title, setTitle] = useState("");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [results, setResults] = useState<GameResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedGames, setSelectedGames] = useState<GameResult[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setQuery("");
            setDebouncedQuery("");
            setResults([]);
            setSelectedGames([]);
            setIsSaving(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 400);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        let cancelled = false;
        setIsSearching(true);

        onSearch(debouncedQuery).then((data) => {
            if (!cancelled) {
                setResults(data || []);
                setIsSearching(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, onSearch]);

    const handleSelect = (game: GameResult) => {
        if (!selectedGames.some(g => g.id === game.id)) {
            setSelectedGames([...selectedGames, game]);
        }
    };

    const handleRemoveSelected = (id: number) => {
        setSelectedGames(selectedGames.filter(g => g.id !== id));
    };

    const handleSave = async () => {
        if (!title.trim() || selectedGames.length === 0) return;

        setIsSaving(true);
        try {
            await onAdd(title, selectedGames.map(g => ({
                gambrainId: g.id,
                gameName: g.name,
                gameImage: g.image,
                storeUrl: g.url,
            })));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-6">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Create New Wishlist</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-2 flex-1 overflow-hidden flex flex-col min-h-[400px]">
                    {/* Title Input */}
                    <div className="space-y-2 shrink-0">
                        <Label htmlFor="wishlist-title">Wishlist Name</Label>
                        <Input
                            id="wishlist-title"
                            placeholder="e.g. Co-op Games, Scary Games..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
                        {/* Search & Results Side */}
                        <div className="flex-1 flex flex-col space-y-3 min-w-0 border-r pr-6">
                            <div className="space-y-2 shrink-0">
                                <Label htmlFor="game-search">Search Games to Add</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="game-search"
                                        placeholder="Search for a game..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 rounded-lg">
                                <div className="space-y-2 pr-2">
                                    {results.length === 0 && debouncedQuery && !isSearching && (
                                        <div className="py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                            No games found for &quot;{debouncedQuery}&quot;
                                        </div>
                                    )}

                                    {results.length > 0 && results.map((game) => {
                                        const isSelected = selectedGames.some(g => g.id === game.id);
                                        return (
                                            <div
                                                key={game.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer select-none group ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/30 hover:bg-muted/30'}`}
                                                onClick={() => !isSelected && handleSelect(game)}
                                            >
                                                <div className="h-10 w-16 rounded overflow-hidden bg-muted shrink-0">
                                                    {game.image ? (
                                                        <img
                                                            src={game.image}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-[10px]">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {game.name}
                                                    </p>
                                                    {game.released && (
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {game.released}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="shrink-0 pr-2">
                                                    {isSelected ? (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <Button size="sm" variant="ghost" className="h-7 px-2 opacity-0 group-hover:opacity-100 p-0 text-muted-foreground border shadow-sm">
                                                            Add
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Selected Games Side */}
                        <div className="w-[280px] shrink-0 flex flex-col space-y-3 min-w-0">
                            <div className="flex items-center justify-between shrink-0">
                                <Label>Included Games</Label>
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                                    {selectedGames.length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 bg-muted/20 border rounded-lg p-3">
                                {selectedGames.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                                        <p className="text-sm font-medium">No games added</p>
                                        <p className="text-xs mt-1">Search and click &quot;Add&quot; to include games in this list.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedGames.map(game => (
                                            <div key={game.id} className="flex flex-col gap-2 p-2 bg-background border rounded shadow-sm group">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-xs font-medium leading-tight line-clamp-2 flex-1 mt-0.5">{game.name}</p>
                                                    <button
                                                        onClick={() => handleRemoveSelected(game.id)}
                                                        className="h-5 w-5 shrink-0 flex items-center justify-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="shrink-0 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!title.trim() || selectedGames.length === 0 || isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Wishlist
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
