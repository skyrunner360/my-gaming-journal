"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gamepad2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    has_community_visible_stats?: boolean;
}

interface PSNGame {
    name: string;
    // Add more fields if needed
}

interface JournalClientProps {
    steamGames: Game[];
    psnGames: PSNGame[];
}

export function JournalClient({ steamGames, psnGames }: JournalClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredSteamGames = steamGames.filter((game) =>
        game.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    return (
        <Tabs defaultValue="raw" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="raw">Raw Journals</TabsTrigger>
                <TabsTrigger value="backlogs">Backlogs</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
            </TabsList>

            <TabsContent value="raw" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm font-medium">Empty Journal</p>
                            <p className="text-xs text-muted-foreground">
                                Start your first entry to see it here.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="backlogs">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">No backlogs yet.</p>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="wishlist">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="library" className="space-y-6 h-[calc(100vh-280px)] min-h-[500px]">
                <div className="flex items-center justify-between gap-4 py-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search your library..."
                            className="pl-9 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-md border text-xs font-medium">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        <span>{filteredSteamGames.length} Games</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 h-[calc(100%-60px)] overflow-hidden">
                    {/* Steam Section */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-center gap-2 border-b pb-2 mb-4 shrink-0">
                            <Gamepad2 className="h-5 w-5 text-[#003087]" />
                            <h3 className="font-semibold text-lg">Steam Library</h3>
                        </div>

                        <ScrollArea className="flex-1 pr-4">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 pb-8">
                                {filteredSteamGames.map((game) => (
                                    <Card key={game.appid} className="overflow-hidden py-0 group hover:border-primary/50 transition-colors">
                                        <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                            <img
                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                                alt={game.name}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                                                }}
                                            />
                                        </div>
                                        <CardHeader humanitarian-p-padding="p-2" className="p-2 space-y-1">
                                            <CardTitle className="text-xs line-clamp-1 h-4">
                                                {game.name}
                                            </CardTitle>
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
                                ))}

                                {filteredSteamGames.length === 0 && (
                                    <div className="col-span-full py-12 text-center bg-muted/30 rounded-lg border border-dashed">
                                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-sm text-muted-foreground">
                                            {searchQuery ? `No games matching "${searchQuery}"` : "No Steam games found."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* PSN Section */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-center gap-2 border-b pb-2 mb-4 shrink-0">
                            <Gamepad2 className="h-5 w-5 text-[#003087]" />
                            <h3 className="font-semibold text-lg">PSN Library</h3>
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="py-8 text-center bg-muted/50 rounded-lg border border-dashed">
                                <p className="text-sm text-muted-foreground">PSN library sync coming soon.</p>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
