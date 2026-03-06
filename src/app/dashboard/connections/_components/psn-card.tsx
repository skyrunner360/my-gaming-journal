"use client";

import { CheckCircle2, ExternalLink, Gamepad2 } from "lucide-react";
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
import { connectPSN, disconnectConnection } from "../actions";
import { ConnectionField } from "./connection-field";

interface PsnCardProps {
	connection?: { type: string; value: string };
}

export function PsnCard({ connection }: PsnCardProps) {
	const [isConnecting, setIsConnecting] = useState(false);
	const [isUnlinking, setIsUnlinking] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsConnecting(true);
		try {
			const formData = new FormData(e.currentTarget);
			await connectPSN(formData);
		} catch (error) {
			console.error("Failed to connect PSN:", error);
		} finally {
			setIsConnecting(false);
		}
	};

	const handleUnlink = async () => {
		setIsUnlinking(true);
		try {
			await disconnectConnection("PSN");
		} catch (error) {
			console.error("Failed to unlink PSN:", error);
		} finally {
			setIsUnlinking(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Gamepad2 className="h-5 w-5 text-[#003087]" />
						<CardTitle>PlayStation Network</CardTitle>
					</div>
					{connection && (
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
				{connection ? (
					<div className="space-y-4">
						<ConnectionField
							value={connection.value}
							onUnlink={handleUnlink}
							isUnlinking={isUnlinking}
							copyId="psn"
						/>
						<p className="text-xs text-muted-foreground text-center">
							Your PSN token is securely encrypted for privacy.
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="psnToken">PSN Cookie Token</Label>
								<a
									href="https://github.com/mizne/psn-nps?tab=readme-ov-file#obtaining-a-psn-cookie-token"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[10px] text-muted-foreground hover:text-primary underline underline-offset-2 flex items-center gap-1"
								>
									How to find? <ExternalLink className="h-2 w-2" />
								</a>
							</div>
							<Input
								id="psnToken"
								name="psnToken"
								type="password"
								placeholder="Enter your PSN token"
								required
								disabled={isConnecting}
							/>
						</div>
						<Button
							type="submit"
							className="w-full bg-[#003087] hover:bg-[#003bb0] text-white"
							disabled={isConnecting}
						>
							{isConnecting ? "Connecting..." : "Connect Token"}
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
