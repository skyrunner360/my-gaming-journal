export default function AccountPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
			<p className="text-muted-foreground">
				Manage your profile, preferences, and linked accounts.
			</p>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<p className="text-sm font-medium">Profile Informtion</p>
					<p className="text-xs text-muted-foreground">
						Update your display name and email preferences.
					</p>
				</div>
			</div>
		</div>
	);
}
