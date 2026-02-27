import { Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PsnSectionProps {
	isConnected: boolean;
}

const STATS = [
	{ title: "Trophies", placeholder: "1,420" },
	{ title: "Platinum", placeholder: "15" },
	{ title: "PS+ Status", placeholder: "Premium" },
	{ title: "Active Gaming", placeholder: "Spider-Man 2" },
];

export function PsnSection({ isConnected }: PsnSectionProps) {
	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2">
				<Gamepad2 className="h-5 w-5 text-[#003087]" />
				<h2 className="text-xl font-semibold tracking-tight">
					PlayStation Overview
				</h2>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{isConnected ? (
					<>
						{STATS.map((stat) => (
							<Card key={stat.title}>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
										{stat.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold">{stat.placeholder}</p>
									<p className="text-[10px] text-muted-foreground mt-1">
										Connected via token
									</p>
								</CardContent>
							</Card>
						))}
					</>
				) : (
					STATS.map((stat) => (
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
					))
				)}
			</div>
		</section>
	);
}
