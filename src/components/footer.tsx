import { BookOpen } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold tracking-tight">Digital Game Journal</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Digital Game Journal. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
