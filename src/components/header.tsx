"use client";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { authClient } from "@/lib/auth-client";

export function Header() {
	const { data: session } = authClient.useSession();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2">
					<BookOpen className="h-6 w-6 text-primary" />
					<span className="text-xl font-bold tracking-tight">
						Digital Game Journal
					</span>
				</Link>
				<div className="flex items-center gap-4">
					<ThemeToggle />
					{session ? (
						<UserButton user={session.user} />
					) : (
						<>
							<Link href="/signin">
								<Button variant="ghost" className="text-sm font-medium">
									Sign In
								</Button>
							</Link>
							<Link href="/signup">
								<Button className="text-sm font-medium">Get Started</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
