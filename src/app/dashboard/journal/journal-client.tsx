"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacklogTab } from "./_components/backlog-tab";
import { GameJournalListModal } from "./_components/game-journal-list-modal";
import { JournalFAB } from "./_components/journal-fab";
import { JournalModal } from "./_components/journal-modal";
import { LibraryTab } from "./_components/library-tab";
import { RawJournalTab } from "./_components/raw-journal-tab";
import { WishlistModal } from "./_components/wishlist-modal";
import { WishlistTab } from "./_components/wishlist-tab";
import {
    createBacklogEntry,
    createJournalEntry,
    createWishlist,
    deleteBacklogEntry,
    deleteJournalEntry,
    deleteWishlist,
    searchGames,
    updateBacklogPositions,
    updateJournalEntry,
} from "./actions";

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    is_family_shared?: boolean;
}

interface JournalEntry {
    id: string;
    content: string;
    gameId?: number | null;
    gameName?: string | null;
    gameIcon?: string | null;
    createdAt: string;
}

interface BacklogItem {
    id: string;
    gameId: number;
    gameName: string;
    gameIcon: string | null;
    position: number;
}

interface WishlistEntry {
    id: string;
    gambrainId: number;
    gameName: string;
    gameImage: string | null;
    storeUrl: string | null;
}

interface Wishlist {
    id: string;
    title: string;
    createdAt: string;
    items: WishlistEntry[];
}

interface JournalClientProps {
    steamGames: Game[];
    initialEntries: JournalEntry[];
    initialBacklog: BacklogItem[];
    initialWishlists: Wishlist[];
}

export function JournalClient({
    steamGames,
    initialEntries,
    initialBacklog,
    initialWishlists,
}: JournalClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [selectedGameForJournals, setSelectedGameForJournals] =
        useState<Game | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
    const [backlog, setBacklog] = useState<BacklogItem[]>(initialBacklog);

    // ─── Journal Handlers ─────────────────────────────────

    const handleSaveEntry = async (data: {
        content: string;
        gameId?: number;
        gameName?: string;
        gameIcon?: string;
    }) => {
        if (editingEntry) {
            const updatedEntry = await updateJournalEntry(editingEntry.id, data);
            const serializedEntry = {
                id: updatedEntry.id,
                content: updatedEntry.content,
                gameId: updatedEntry.gameId,
                gameName: updatedEntry.gameName,
                gameIcon: updatedEntry.gameIcon,
                createdAt: updatedEntry.createdAt.toISOString(),
            };
            setEntries(
                entries.map((e) =>
                    e.id === editingEntry.id ? serializedEntry : e,
                ),
            );
        } else {
            const newEntry = await createJournalEntry(data);
            const serializedEntry = {
                id: newEntry.id,
                content: newEntry.content,
                gameId: newEntry.gameId,
                gameName: newEntry.gameName,
                gameIcon: newEntry.gameIcon,
                createdAt: newEntry.createdAt.toISOString(),
            };
            setEntries([serializedEntry, ...entries]);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        await deleteJournalEntry(id);
        setEntries(entries.filter((e) => e.id !== id));
    };

    const handleEditEntry = (entry: { id: string; content: string; gameId?: number | null; gameName?: string | null; gameIcon?: string | null; createdAt: string | Date }) => {
        const entryToEdit: JournalEntry = {
            id: entry.id,
            content: entry.content,
            gameId: entry.gameId,
            gameName: entry.gameName,
            gameIcon: entry.gameIcon,
            createdAt:
                typeof entry.createdAt === "string"
                    ? entry.createdAt
                    : entry.createdAt.toISOString(),
        };
        setEditingEntry(entryToEdit);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleGameSelect = (game: Game) => {
        setSelectedGameForJournals(game);
        setIsListModalOpen(true);
    };

    const filteredEntriesForGame = selectedGameForJournals
        ? entries.filter((e) => e.gameId === selectedGameForJournals.appid)
        : [];

    // ─── Backlog Handlers ─────────────────────────────────

    const handleAddToBacklog = async (game: Game) => {
        const newEntry = await createBacklogEntry({
            gameId: game.appid,
            gameName: game.name,
            gameIcon: game.img_icon_url,
        });
        setBacklog([
            ...backlog,
            {
                id: newEntry.id,
                gameId: newEntry.gameId,
                gameName: newEntry.gameName,
                gameIcon: newEntry.gameIcon,
                position: newEntry.position,
            },
        ]);
    };

    const handleRemoveFromBacklog = async (id: string) => {
        await deleteBacklogEntry(id);
        setBacklog(backlog.filter((b) => b.id !== id));
    };

    const handleReorderBacklog = async (
        items: { id: string; position: number }[],
    ) => {
        await updateBacklogPositions(items);
    };

    // ─── Wishlist Handlers ─────────────────────────────────

    const [wishlists, setWishlists] = useState<Wishlist[]>(initialWishlists);
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

    const handleSearchGames = useCallback(async (query: string) => {
        return await searchGames(query);
    }, []);

    const handleCreateWishlist = async (
        title: string,
        items: {
            gambrainId: number;
            gameName: string;
            gameImage?: string;
            storeUrl?: string;
        }[],
    ) => {
        const newList = await createWishlist(title, items);
        setWishlists([
            {
                id: newList.id,
                title: newList.title,
                createdAt: newList.createdAt.toISOString(),
                items: newList.items.map((i) => ({
                    id: i.id,
                    gambrainId: i.gambrainId,
                    gameName: i.gameName,
                    gameImage: i.gameImage,
                    storeUrl: i.storeUrl,
                })),
            },
            ...wishlists,
        ]);
        setIsWishlistModalOpen(false);
    };

    const handleDeleteWishlist = async (id: string, title: string) => {
        await deleteWishlist(id);
        setWishlists(wishlists.filter((w) => w.id !== id));
    };

    return (
        <div className="relative">
            <Tabs defaultValue="raw" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="raw">Raw Journals</TabsTrigger>
                    <TabsTrigger value="backlogs">Backlogs</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="library">Library</TabsTrigger>
                </TabsList>

                <TabsContent value="raw">
                    <RawJournalTab
                        entries={entries.map((e) => ({
                            ...e,
                            createdAt: new Date(e.createdAt),
                        }))}
                        onAddNew={handleAddNew}
                        onEdit={handleEditEntry}
                        onDelete={handleDeleteEntry}
                    />
                </TabsContent>

                <TabsContent value="backlogs">
                    <BacklogTab
                        steamGames={steamGames}
                        backlogItems={backlog}
                        onAddToBacklog={handleAddToBacklog}
                        onRemoveFromBacklog={handleRemoveFromBacklog}
                        onReorder={handleReorderBacklog}
                    />
                </TabsContent>

                <TabsContent value="wishlist">
                    <WishlistTab
                        lists={wishlists}
                        onAddNew={() => setIsWishlistModalOpen(true)}
                        onDelete={handleDeleteWishlist}
                    />
                </TabsContent>

                <TabsContent value="library">
                    <LibraryTab
                        steamGames={steamGames}
                        entries={entries}
                        onGameSelect={handleGameSelect}
                    />
                </TabsContent>
            </Tabs>

            <JournalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEntry(null);
                }}
                onSave={handleSaveEntry}
                games={steamGames}
                initialData={
                    editingEntry
                        ? {
                            content: editingEntry.content,
                            gameId: editingEntry.gameId,
                        }
                        : undefined
                }
            />

            <GameJournalListModal
                isOpen={isListModalOpen}
                onClose={() => {
                    setIsListModalOpen(false);
                    setSelectedGameForJournals(null);
                }}
                game={selectedGameForJournals}
                entries={filteredEntriesForGame.map((e) => ({
                    ...e,
                    createdAt: new Date(e.createdAt),
                }))}
                onEditEntry={(entry) => {
                    setIsListModalOpen(false);
                    handleEditEntry(entry);
                }}
                onDeleteEntry={handleDeleteEntry}
            />

            <WishlistModal
                isOpen={isWishlistModalOpen}
                onClose={() => setIsWishlistModalOpen(false)}
                onAdd={handleCreateWishlist}
                onSearch={handleSearchGames}
            />

            <JournalFAB onClick={handleAddNew} />
        </div>
    );
}
