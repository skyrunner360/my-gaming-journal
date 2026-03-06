"use client";

import { NotebookPen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalFABProps {
	onClick: () => void;
}

export function JournalFAB({ onClick }: JournalFABProps) {
	return (
		<Button
			onClick={onClick}
			className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-[#003087] hover:bg-[#003bb0] text-white p-0 flex items-center justify-center z-50 group transition-all hover:scale-110 active:scale-95 border-none"
			size="icon"
		>
			<div className="relative">
				<NotebookPen className="h-6 w-6" />
				<div className="absolute -top-1.5 -right-1.5 bg-[#003087] group-hover:bg-[#003bb0] rounded-full p-0.5 transition-colors">
					<Plus className="h-3 w-3" />
				</div>
			</div>
			<span className="sr-only">New Journal Entry</span>
		</Button>
	);
}
