"use client";

import { PsnCard } from "./_components/psn-card";
import { SteamCard } from "./_components/steam-card";

interface ConnectionsClientProps {
	initialConnections: { type: string; value: string }[];
}

export function ConnectionsClient({
	initialConnections,
}: ConnectionsClientProps) {
	const steamConnection = initialConnections.find((c) => c.type === "STEAM");
	const psnConnection = initialConnections.find((c) => c.type === "PSN");
	const familyConnection = initialConnections.find(
		(c) => c.type === "STEAM_FAMILY",
	);

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<SteamCard
				connection={steamConnection}
				familyConnection={familyConnection}
			/>
			<PsnCard connection={psnConnection} />
		</div>
	);
}
