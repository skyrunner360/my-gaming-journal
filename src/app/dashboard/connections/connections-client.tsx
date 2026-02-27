"use client";

import { Check, CheckCircle2, Copy, Gamepad2 } from "lucide-react";
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
import { connectPSN, connectSteam } from "./actions";

interface ConnectionsClientProps {
	initialConnections: { type: string; value: string }[];
}

export function ConnectionsClient({
	initialConnections,
}: ConnectionsClientProps) {
	const [isSteamConnecting, setIsSteamConnecting] = useState(false);
	const [isPsnConnecting, setIsPsnConnecting] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const steamConnection = initialConnections.find((c) => c.type === "STEAM");
	const psnConnection = initialConnections.find((c) => c.type === "PSN");

	const copyToClipboard = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const handleSteamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSteamConnecting(true);
		try {
			const formData = new FormData(e.currentTarget);
			await connectSteam(formData);
		} catch (error) {
			console.error("Failed to connect Steam:", error);
		} finally {
			setIsSteamConnecting(false);
		}
	};

	const handlePsnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPsnConnecting(true);
		try {
			const formData = new FormData(e.currentTarget);
			await connectPSN(formData);
		} catch (error) {
			console.error("Failed to connect PSN:", error);
		} finally {
			setIsPsnConnecting(false);
		}
	};

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Gamepad2 className="h-5 w-5 text-[#003087]" />
							<CardTitle>Steam</CardTitle>
						</div>
						{steamConnection && (
							<div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
								<CheckCircle2 className="h-3 w-3" />
								Connected
							</div>
						)}
					</div>
					<CardDescription>
						Connect your Steam account to sync your library and playtime.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{steamConnection ? (
						<div className="space-y-4">
							<div className="rounded-lg bg-muted p-3">
								<div className="flex items-center justify-between gap-2">
									<span className="text-sm font-mono text-muted-foreground break-all">
										{steamConnection.value}
									</span>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
										onClick={() =>
											copyToClipboard(steamConnection.value, "steam")
										}
									>
										{copiedId === "steam" ? (
											<Check className="h-4 w-4 text-green-600" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
							<p className="text-xs text-muted-foreground text-center">
								Your Steam ID is securely encrypted for privacy.
							</p>
						</div>
					) : (
						<form onSubmit={handleSteamSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="steamId">Steam ID</Label>
								<Input
									id="steamId"
									name="steamId"
									placeholder="Enter your Steam ID"
									required
									disabled={isSteamConnecting}
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-[#003087] hover:bg-[#003bb0] text-white"
								disabled={isSteamConnecting}
							>
								{isSteamConnecting ? "Connecting..." : "Connect Steam"}
							</Button>
						</form>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Gamepad2 className="h-5 w-5 text-[#003087]" />
							<CardTitle>PlayStation Network</CardTitle>
						</div>
						{psnConnection && (
							<div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
								<CheckCircle2 className="h-3 w-3" />
								Connected
							</div>
						)}
					</div>
					<CardDescription>
						Link your PSN account using a cookie token.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{psnConnection ? (
						<div className="space-y-4">
							<div className="rounded-lg bg-muted p-3">
								<div className="flex items-center justify-between gap-2">
									<span className="text-sm font-mono text-muted-foreground break-all">
										{psnConnection.value}
									</span>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
										onClick={() => copyToClipboard(psnConnection.value, "psn")}
									>
										{copiedId === "psn" ? (
											<Check className="h-4 w-4 text-green-600" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
							<p className="text-xs text-muted-foreground text-center">
								Your PSN token is securely encrypted for privacy.
							</p>
						</div>
					) : (
						<form onSubmit={handlePsnSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="psnToken">PSN Cookie Token</Label>
								<Input
									id="psnToken"
									name="psnToken"
									type="password"
									placeholder="Enter your PSN token"
									required
									disabled={isPsnConnecting}
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-[#003087] hover:bg-[#003bb0] text-white"
								disabled={isPsnConnecting}
							>
								{isPsnConnecting ? "Connecting..." : "Connect Token"}
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
