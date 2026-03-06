"use client";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface JournalPlusCardProps {
	onClick: () => void;
}

export function JournalPlusCard({ onClick }: JournalPlusCardProps) {
	return (
		<Card
			className="group cursor-pointer border-dashed hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 h-full min-h-[140px] flex items-center justify-center"
			onClick={onClick}
		>
			<CardContent className="p-0 flex flex-col items-center gap-2">
				<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
					<Plus className="h-6 w-6" />
				</div>
				<p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
					New Entry
				</p>
			</CardContent>
		</Card>
	);
}
