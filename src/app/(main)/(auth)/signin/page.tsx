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

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const { error: signInError } = await authClient.signIn.email({
				email,
				password,
			});

			if (signInError) {
				setError(signInError.message || "Invalid email or password");
				return;
			}

			router.push("/dashboard");
			router.refresh();
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "An unexpected error occurred during sign in";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handleDiscordSignIn = async () => {
		setError(null);
		try {
			await authClient.signIn.social({
				provider: "discord",
				callbackURL: "/dashboard",
				errorCallbackURL: "/signin",
			});
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Discord sign in failed";
			setError(message);
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
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>
						Enter your email to sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{error && (
						<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center font-medium">
							{error}
						</div>
					)}
					<div className="grid grid-cols-1 gap-6">
						<Button
							variant="outline"
							onClick={handleDiscordSignIn}
							className="w-full"
						>
							<svg
								className="mr-2 h-4 w-4"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="discord"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 640 512"
							>
								<path
									fill="currentColor"
									d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.906 30.607 447.848 447.848 0 0 0-134.426 0 302.405 302.405 0 0 0-15.185-30.607 1.808 1.808 0 0 0-1.923-.91 483.013 483.013 0 0 0-119.688 37.107 1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375 487.666 487.666 0 0 0 146.825 74.189 1.9 1.9 0 0 0 2.063-.676A348.2 348.2 0 0 0 208.12 430.4a1.819 1.819 0 0 0-1.017-2.588 321.735 321.735 0 0 1-45.868-21.853 1.885 1.885 0 0 1-.185-3.126 245.759 245.759 0 0 0 9.109-7.137 1.819 1.819 0 0 1 1.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 0 1 1.924.233 234.533 234.533 0 0 0 9.132 7.16 1.884 1.884 0 0 1-.162 3.126 301.407 301.407 0 0 1-45.89 21.83 1.819 1.819 0 0 0-1.017 2.588 354.463 354.463 0 0 0 20.01 49.33 1.9 1.9 0 0 0 2.063.676 491.048 491.048 0 0 0 146.893-74.145 2.068 2.068 0 0 0 .765-1.375c13.176-124.234-22.31-233.99-106.398-334.518zM209.73 337.034c-28.744 0-52.193-26.392-52.193-58.87 0-32.478 23.1-58.87 52.193-58.87 29.412 0 52.528 26.392 52.193 58.87 0 32.478-23.1 58.87-52.193-58.87zm220.541 0c-28.744 0-52.193-26.392-52.193-58.87 0-32.478 23.1-58.87 52.193-58.87 29.412 0 52.528 26.392 52.193 58.87 0 32.478-23.1 58.87-52.193-58.87z"
								/>
							</svg>
							Discord
						</Button>
					</div>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with email
							</span>
						</div>
					</div>
					<form onSubmit={handleEmailSignIn}>
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
							{loading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-wrap items-center justify-center gap-2">
					<div className="text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary underline-offset-4 hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
