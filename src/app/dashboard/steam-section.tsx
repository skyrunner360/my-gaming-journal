import { ExternalLink, Gamepad2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SteamSectionProps {
	playerData?: {
		personaname: string;
		avatarfull: string;
		profileurl: string;
		personastate: number;
		lastlogoff?: number;
	} | null;
	steamLevel?: number | null;
	isConnected: boolean;
}

const STATS = [
	{ title: "Total Playtime", placeholder: "1,248 hrs" },
	{ title: "Games Owned", placeholder: "142" },
	{ title: "Achievements", placeholder: "856" },
];

export function SteamSection({
	playerData,
	steamLevel,
	isConnected,
}: SteamSectionProps) {
	const formatLastLogoff = (timestamp?: number) => {
		if (!timestamp) return null;
		const date = new Date(timestamp * 1000);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
		}).format(date);
	};

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2">
				<Gamepad2 className="h-5 w-5 text-[#003087]" />
				<h2 className="text-xl font-semibold tracking-tight">Steam Overview</h2>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{isConnected ? (
					playerData ? (
						<>
							<Card className="col-span-full sm:col-span-1 lg:col-span-1 border-primary/20 bg-gradient-to-br from-card to-primary/5">
								<CardHeader className="flex flex-row items-center gap-4 pb-2">
									<Avatar className="h-12 w-12 border-2 border-[#1b2838] shrink-0">
										<AvatarImage
											src={playerData.avatarfull}
											alt={playerData.personaname}
										/>
										<AvatarFallback>
											{playerData.personaname?.[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col min-w-0">
										<div className="flex items-center gap-2">
											<CardTitle className="text-lg truncate">
												{playerData.personaname}
											</CardTitle>
											{steamLevel && (
												<div className="flex items-center justify-center h-5 px-1.5 rounded-full bg-[#1b2838] text-[10px] font-bold text-white border border-white/20 min-w-[24px]">
													{steamLevel}
												</div>
											)}
										</div>
										<div className="space-y-0.5">
											<p className="text-xs text-muted-foreground flex items-center gap-1.5">
												<span
													className={`h-1.5 w-1.5 rounded-full ${playerData.personastate === 0 ? "bg-slate-400" : "bg-green-500"}`}
												/>
												{playerData.personastate === 0 ? "Offline" : "Online"}
											</p>
											{playerData.lastlogoff && (
												<p className="text-[12px] text-muted-foreground italic">
													Last seen: {formatLastLogoff(playerData.lastlogoff)}
												</p>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<Button
										variant="outline"
										size="sm"
										className="w-full gap-2 text-xs"
										asChild
									>
										<a
											href={playerData.profileurl}
											target="_blank"
											rel="noopener noreferrer"
										>
											View Profile <ExternalLink className="h-3 w-3" />
										</a>
									</Button>
								</CardContent>
							</Card>

							{STATS.map((stat) => (
								<Card key={stat.title}>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
											{stat.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-2xl font-bold">{stat.placeholder}</p>

									</CardContent>
								</Card>
							))}
						</>
					) : (
						<Card className="col-span-full border-dashed border-amber-200 bg-amber-50/50">
							<CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-3">
								<div className="space-y-1">
									<p className="text-sm font-semibold text-amber-900">
										Legacy Data Detected
									</p>
									<p className="text-xs text-amber-700 max-w-md">
										Because we switched to secure reversible encryption, you
										need to re-link your Steam account to see live statistics.
									</p>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="border-amber-200 hover:bg-amber-100 text-amber-900"
									asChild
								>
									<a href="/dashboard/connections">Re-link Account</a>
								</Button>
							</CardContent>
						</Card>
					)
				) : (
					<>
						<Card className="opacity-60 grayscale-[0.5]">
							<CardHeader className="flex flex-row items-center gap-4 pb-2">
								<div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
								<div className="space-y-2">
									<div className="h-4 w-24 bg-muted animate-pulse rounded" />
									<div className="h-3 w-12 bg-muted animate-pulse rounded" />
								</div>
							</CardHeader>
							<CardContent>
								<Button disabled size="sm" className="w-full text-xs">
									Connect Steam
								</Button>
							</CardContent>
						</Card>

						{STATS.map((stat) => (
							<Card key={stat.title} className="opacity-60">
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
										{stat.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold blur-sm select-none">
										{stat.placeholder}
									</p>
								</CardContent>
							</Card>
						))}
					</>
				)}
			</div>
		</section>
	);
}
