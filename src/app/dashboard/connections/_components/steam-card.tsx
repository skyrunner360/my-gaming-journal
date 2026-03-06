"use client";

import {
	CheckCircle2,
	ExternalLink,
	Gamepad2,
	Loader2,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	connectSteam,
	disconnectConnection,
	removeSteamFamilyMember,
	updateSteamFamilyIDs,
} from "../actions";
import { ConnectionField } from "./connection-field";

interface SteamCardProps {
	connection?: { type: string; value: string };
	familyConnection?: { type: string; value: string };
}

export function SteamCard({ connection, familyConnection }: SteamCardProps) {
	const [isConnecting, setIsConnecting] = useState(false);
	const [isUnlinking, setIsUnlinking] = useState(false);
	const [isFamilyUpdating, setIsFamilyUpdating] = useState(false);
	const [newFamilyId, setNewFamilyId] = useState("");

	const familyIds = familyConnection
		? familyConnection.value
				.split(",")
				.map((id) => id.trim())
				.filter(Boolean)
		: [];

	const handleSteamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsConnecting(true);
		try {
			const formData = new FormData(e.currentTarget);
			await connectSteam(formData);
		} catch (error) {
			console.error("Failed to connect Steam:", error);
		} finally {
			setIsConnecting(false);
		}
	};

	const handleUnlink = async () => {
		setIsUnlinking(true);
		try {
			await disconnectConnection("STEAM");
		} catch (error) {
			console.error("Failed to unlink Steam:", error);
		} finally {
			setIsUnlinking(false);
		}
	};

	const handleAddFamilyMember = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newFamilyId || familyIds.length >= 3) return;

		setIsFamilyUpdating(true);
		try {
			await updateSteamFamilyIDs(newFamilyId);
			setNewFamilyId("");
		} catch (error) {
			console.error("Failed to add family member:", error);
		} finally {
			setIsFamilyUpdating(false);
		}
	};

	const handleRemoveFamilyMember = async (steamId: string) => {
		setIsFamilyUpdating(true);
		try {
			await removeSteamFamilyMember(steamId);
		} catch (error) {
			console.error("Failed to remove family member:", error);
		} finally {
			setIsFamilyUpdating(false);
		}
	};

	return (
		<Card className={connection ? "md:row-span-2" : ""}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Gamepad2 className="h-5 w-5 text-[#003087]" />
						<CardTitle>Steam</CardTitle>
					</div>
					{connection && (
						<div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
							<CheckCircle2 className="h-3 w-3" />
							Connected
						</div>
					)}
				</div>
				<CardDescription>
					Connect your accounts to sync your library and playtime.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Main Steam Connection */}
				<div className="space-y-4">
					<Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
						Your Profile
					</Label>
					{connection ? (
						<ConnectionField
							value={connection.value}
							onUnlink={handleUnlink}
							isUnlinking={isUnlinking}
							copyId="steam"
						/>
					) : (
						<form onSubmit={handleSteamSubmit} className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="steamId">Steam ID</Label>
									<a
										href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC"
										target="_blank"
										rel="noopener noreferrer"
										className="text-[10px] text-muted-foreground hover:text-primary underline underline-offset-2 flex items-center gap-1"
									>
										How to find? <ExternalLink className="h-2 w-2" />
									</a>
								</div>
								<Input
									id="steamId"
									name="steamId"
									placeholder="Enter your Steam ID"
									required
									disabled={isConnecting}
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-[#003087] hover:bg-[#003bb0] text-white"
								disabled={isConnecting}
							>
								{isConnecting ? "Connecting..." : "Connect Steam"}
							</Button>
						</form>
					)}
				</div>

				{/* Family Sharing Section */}
				<div className="pt-6 border-t space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
							Family Library (Max 3)
						</Label>
						<span className="text-xs text-muted-foreground">
							{familyIds.length}/3 members
						</span>
					</div>

					<div className="space-y-2">
						{familyIds.map((id) => (
							<div
								key={id}
								className="rounded-lg border bg-card p-2 flex items-center justify-between gap-2"
							>
								<span className="text-xs font-mono text-muted-foreground truncate px-2">
									{id}
								</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
									onClick={() => handleRemoveFamilyMember(id)}
									disabled={isFamilyUpdating}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						))}

						{familyIds.length < 3 && (
							<form onSubmit={handleAddFamilyMember} className="flex gap-2">
								<Input
									placeholder="Family Member SteamID64"
									value={newFamilyId}
									onChange={(e) => setNewFamilyId(e.target.value)}
									className="h-9 text-xs"
									disabled={isFamilyUpdating}
								/>
								<Button
									type="submit"
									size="icon"
									className="h-9 w-9 shrink-0"
									disabled={isFamilyUpdating || !newFamilyId}
								>
									{isFamilyUpdating ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Plus className="h-4 w-4" />
									)}
								</Button>
							</form>
						)}

						{familyIds.length === 0 && !isFamilyUpdating && (
							<p className="text-[10px] text-muted-foreground text-center py-2 italic">
								No family members added yet.
							</p>
						)}
					</div>

					<p className="text-[10px] text-muted-foreground leading-tight">
						Games from these members will be merged into your library. They must
						have their <strong>Game Details</strong> set to{" "}
						<strong>Public</strong>.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
