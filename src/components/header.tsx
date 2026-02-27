import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">Digital Game Journal</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" className="text-sm font-medium">
                        Sign In
                    </Button>
                    <Button className="text-sm font-medium">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    );
}
