"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    DragOverlay,
    useDroppable,
    useDraggable,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
}

interface BacklogItem {
    id: string;
    gameId: number;
    gameName: string;
    gameIcon: string | null;
    position: number;
}

interface BacklogTabProps {
    steamGames: Game[];
    backlogItems: BacklogItem[];
    onAddToBacklog: (game: Game) => Promise<void>;
    onRemoveFromBacklog: (id: string) => Promise<void>;
    onReorder: (items: { id: string; position: number }[]) => Promise<void>;
}

// ─── Sortable Backlog Item ─────────────────────────────────

function SortableBacklogItem({
    item,
    index,
    onRemove,
}: {
    item: BacklogItem;
    index: number;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-background transition-all group ${isDragging
                    ? "shadow-lg ring-2 ring-primary/30 opacity-90 z-50"
                    : "hover:border-primary/20 hover:bg-muted/30"
                }`}
        >
            <button
                type="button"
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none shrink-0"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <span className="text-xs font-mono text-muted-foreground/60 w-6 text-center shrink-0">
                {index + 1}
            </span>

            <img
                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.gameId}/header.jpg`}
                alt=""
                className="h-7 w-14 object-cover rounded shrink-0"
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        "https://placehold.co/56x28?text=G";
                }}
            />

            <span className="text-sm font-medium truncate flex-1">
                {item.gameName}
            </span>

            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                onClick={() => {
                    if (window.confirm(`Remove "${item.gameName}" from your backlog?`)) {
                        onRemove(item.id);
                    }
                }}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}

// ─── Draggable Library Item ────────────────────────────────

function DraggableLibraryItem({
    game,
    isAdding,
    onAdd,
}: {
    game: Game;
    isAdding: boolean;
    onAdd: (game: Game) => void;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `library-${game.appid}`,
        data: { type: "library-game", game },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors group ${isDragging ? "opacity-30" : ""
                }`}
        >
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                disabled={isAdding}
                onClick={() => onAdd(game)}
            >
                <Plus className="h-4 w-4" />
            </Button>

            <div
                className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing touch-none"
                {...attributes}
                {...listeners}
            >
                <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt=""
                    className="h-6 w-12 object-cover rounded shrink-0"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/48x24?text=G";
                    }}
                />

                <span className="text-sm truncate flex-1">{game.name}</span>
            </div>

            <a
                href={`https://store.steampowered.com/app/${game.appid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity shrink-0"
            >
                <ExternalLink className="h-3.5 w-3.5" />
            </a>
        </div>
    );
}

// ─── Droppable Backlog Zone ────────────────────────────────

function BacklogDropZone({
    children,
    isEmpty,
}: {
    children: React.ReactNode;
    isEmpty: boolean;
}) {
    const { isOver, setNodeRef } = useDroppable({ id: "backlog-drop-zone" });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 rounded-lg transition-all ${isOver
                    ? "ring-2 ring-primary/40 bg-primary/5"
                    : ""
                } ${isEmpty ? "flex items-center justify-center border-2 border-dashed bg-muted/20" : ""}`}
        >
            {children}
        </div>
    );
}

// ─── Drag Overlay Content ──────────────────────────────────

function DragOverlayContent({ game }: { game: Game }) {
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-background shadow-xl w-64">
            <img
                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt=""
                className="h-7 w-14 object-cover rounded shrink-0"
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        "https://placehold.co/56x28?text=G";
                }}
            />
            <span className="text-sm font-medium truncate">{game.name}</span>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────

export function BacklogTab({
    steamGames,
    backlogItems,
    onAddToBacklog,
    onRemoveFromBacklog,
    onReorder,
}: BacklogTabProps) {
    const [items, setItems] = useState<BacklogItem[]>(backlogItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [addingGameId, setAddingGameId] = useState<number | null>(null);
    const [draggingGame, setDraggingGame] = useState<Game | null>(null);

    useEffect(() => {
        setItems(backlogItems);
    }, [backlogItems]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const backlogGameIds = new Set(items.map((i) => i.gameId));

    const filteredGames = steamGames.filter(
        (g) =>
            !backlogGameIds.has(g.appid) &&
            (g.name || "").toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeId = String(active.id);

        if (activeId.startsWith("library-")) {
            const game = active.data.current?.game as Game;
            if (game) setDraggingGame(game);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingGame(null);

        if (!over) return;

        const activeId = String(active.id);

        // Case 1: Dragging a library item onto the backlog zone
        if (activeId.startsWith("library-")) {
            const game = active.data.current?.game as Game;
            if (game) {
                await handleAddGame(game);
            }
            return;
        }

        // Case 2: Reordering within the backlog
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(items, oldIndex, newIndex);
            const withPositions = reordered.map((item, idx) => ({
                ...item,
                position: idx,
            }));

            setItems(withPositions);
            await onReorder(
                withPositions.map((i) => ({ id: i.id, position: i.position })),
            );
        }
    };

    const handleAddGame = async (game: Game) => {
        setAddingGameId(game.appid);
        try {
            await onAddToBacklog(game);
        } finally {
            setAddingGameId(null);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 min-h-[500px]">
                {/* Left: Backlog List (2/3) */}
                <div className="flex-[2] flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Your Backlog</h3>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border">
                            {items.length} {items.length === 1 ? "game" : "games"}
                        </span>
                    </div>

                    <BacklogDropZone isEmpty={items.length === 0}>
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-sm text-muted-foreground">
                                    Your backlog is empty.
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Add games from your library on the right, or drag them here →
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-full">
                                <SortableContext
                                    items={items.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2 pr-4 pb-4">
                                        {items.map((item, idx) => (
                                            <SortableBacklogItem
                                                key={item.id}
                                                item={item}
                                                index={idx}
                                                onRemove={onRemoveFromBacklog}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </ScrollArea>
                        )}
                    </BacklogDropZone>
                </div>

                {/* Right: Library Selector (1/3) */}
                <div className="flex-1 flex flex-col min-w-0 border-l pl-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-3">Add from Library</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search games..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-1 pr-4 pb-4">
                            {filteredGames.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                    {searchQuery
                                        ? `No games matching "${searchQuery}"`
                                        : "All games already in your backlog!"}
                                </div>
                            ) : (
                                filteredGames.map((game) => (
                                    <DraggableLibraryItem
                                        key={game.appid}
                                        game={game}
                                        isAdding={addingGameId === game.appid}
                                        onAdd={handleAddGame}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Drag overlay for visual feedback */}
            <DragOverlay>
                {draggingGame ? <DragOverlayContent game={draggingGame} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
