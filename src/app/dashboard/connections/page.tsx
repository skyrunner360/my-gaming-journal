export default function ConnectionsPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold tracking-tight">Connections</h1>
			<p className="text-muted-foreground">
				Manage your gaming friends and community connections.
			</p>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<p className="text-sm font-medium">Coming Soon</p>
					<p className="text-xs text-muted-foreground">
						Find and connect with fellow gamers.
					</p>
				</div>
			</div>
		</div>
	);
}
