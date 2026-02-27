export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome back to your gaming journal overview.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
						Entries
					</h3>
					<p className="text-2xl font-bold">0</p>
				</div>
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
						Connections
					</h3>
					<p className="text-2xl font-bold">0</p>
				</div>
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
						Reviews
					</h3>
					<p className="text-2xl font-bold">0</p>
				</div>
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
						Backlog
					</h3>
					<p className="text-2xl font-bold">0</p>
				</div>
			</div>
		</div>
	);
}
