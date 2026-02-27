export default function JournalPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8">My Journal</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Welcome to your journal!</h2>
                    <p className="text-muted-foreground">Start by adding your first game entry or recording a session.</p>
                </div>
            </div>
        </div>
    );
}
