export default function JournalEntriesPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold tracking-tight">Game Journal</h1>
			<p className="text-muted-foreground">
				Your collection of game reviews, logs, and backlog entries.
			</p>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<p className="text-sm font-medium">Empty Journal</p>
					<p className="text-xs text-muted-foreground">
						Start your first entry to see it here.
					</p>
				</div>
			</div>
		</div>
	);
}
