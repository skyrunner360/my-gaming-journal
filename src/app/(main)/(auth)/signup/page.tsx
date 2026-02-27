"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const { error: signUpError } = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (signUpError) {
				setError(signUpError.message || "Failed to create account");
				return;
			}

			router.push("/dashboard");
			router.refresh();
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "An unexpected error occurred during sign up";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<Link href="/" className="flex items-center gap-2">
							<BookOpen className="h-8 w-8 text-primary" />
							<span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
								Journal
							</span>
						</Link>
					</div>
					<CardTitle className="text-2xl font-bold">
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your details below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center font-medium">
							{error}
						</div>
					)}
					<form onSubmit={handleSignUp}>
						<div className="grid gap-2 mb-4">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="grid gap-2 mb-4">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="grid gap-2 mb-4">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? "Creating account..." : "Create Account"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-wrap items-center justify-center gap-2">
					<div className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/signin"
							className="text-primary underline-offset-4 hover:underline"
						>
							Sign in
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
