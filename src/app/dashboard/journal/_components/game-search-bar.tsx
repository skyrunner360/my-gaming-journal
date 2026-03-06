"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GameSearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function GameSearchBar({
	value,
	onChange,
	placeholder = "Search library...",
}: GameSearchBarProps) {
	return (
		<div className="relative flex-1 max-w-sm">
			<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder={placeholder}
				className="pl-9 h-9"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
