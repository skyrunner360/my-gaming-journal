"use client";

import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ConnectionFieldProps {
	value: string;
	onUnlink: () => Promise<void>;
	isUnlinking: boolean;
	label?: string;
	copyId: string;
}

export function ConnectionField({
	value,
	onUnlink,
	isUnlinking,
	label,
	copyId,
}: ConnectionFieldProps) {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(value);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<div className="space-y-4">
			{label && (
				<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
					{label}
				</span>
			)}
			<div className="rounded-lg bg-muted p-3">
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm font-mono text-muted-foreground break-all">
						{value}
					</span>
					<div className="flex items-center gap-1 shrink-0">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={copyToClipboard}
						>
							{isCopied ? (
								<Check className="h-4 w-4 text-green-600" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
							onClick={onUnlink}
							disabled={isUnlinking}
						>
							{isUnlinking ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
