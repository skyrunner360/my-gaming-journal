import { getConnections } from "./actions";
import { ConnectionsClient } from "./connections-client";

export default async function ConnectionsPage() {
	const connections = await getConnections();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Connections</h1>
				<p className="text-muted-foreground">
					Manage your gaming service connections securely.
				</p>
			</div>
			<ConnectionsClient initialConnections={connections} />
		</div>
	);
}
