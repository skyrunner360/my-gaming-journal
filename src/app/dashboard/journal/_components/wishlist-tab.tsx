"use client";

import { ExternalLink, Gamepad2, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

interface WishlistTabProps {
    lists: Wishlist[];
    onAddNew: () => void;
    onDelete: (id: string, title: string) => Promise<void>;
}

export function WishlistTab({ lists, onAddNew, onDelete }: WishlistTabProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-24">
            {/* Plus Card */}
            <Card
                className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all active:scale-[0.98] group"
                onClick={onAddNew}
            >
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Create New Wishlist
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        Group games by genre, platform, etc.
                    </p>
                </CardContent>
            </Card>

            {/* Wishlist Collections */}
            {lists.map((list) => (
                <Card
                    key={list.id}
                    className="flex flex-col min-h-[300px] hover:border-primary/30 transition-all group overflow-hidden bg-background"
                >
                    <CardHeader className="p-4 pb-3 flex flex-row items-start gap-4 space-y-0 bg-muted/20 border-b">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg leading-tight truncate" title={list.title}>
                                {list.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {list.items.length} {list.items.length === 1 ? 'game' : 'games'}
                                </span>
                                <span className="text-muted-foreground/40 text-[10px]">•</span>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {formatDistanceToNow(new Date(list.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        `Delete wishlist "${list.title}" and all its games?`,
                                    )
                                ) {
                                    onDelete(list.id, list.title);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 flex flex-col min-h-0 bg-muted/5">
                        <ScrollArea className="flex-1 h-[220px]">
                            <div className="p-3 space-y-2">
                                {list.items.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground italic flex flex-col items-center">
                                        <Gamepad2 className="h-8 w-8 opacity-20 mb-2" />
                                        Empty list
                                    </div>
                                ) : (
                                    list.items.map((item, idx) => (
                                        <div key={item.id}>
                                            {idx > 0 && <Separator className="my-2 bg-border/40" />}
                                            <div className="flex gap-3 items-center hover:bg-background rounded p-1 transition-colors">
                                                <div className="h-10 w-16 bg-muted rounded overflow-hidden shrink-0 border border-primary/5 shadow-sm">
                                                    {item.gameImage ? (
                                                        <img
                                                            src={item.gameImage}
                                                            alt={item.gameName}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src =
                                                                    "https://placehold.co/64x40?text=G";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                                                            No pic
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="text-sm font-medium leading-tight truncate">
                                                        {item.gameName}
                                                    </p>
                                                    {item.storeUrl && (
                                                        <a
                                                            href={item.storeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                                                        >
                                                            Store Page <ExternalLink className="h-[10px] w-[10px]" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
