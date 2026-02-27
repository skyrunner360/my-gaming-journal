import { Gamepad2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="flex flex-col font-sans">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
					<div className="container mx-auto px-4 relative z-10">
						<div className="mx-auto max-w-[800px] text-center">
							<div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-6 bg-muted/50">
								<span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
								Crafted for mature game enthusiasts
							</div>
							<h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
								The Digital{" "}
								<span className="text-primary italic">Game Journal</span>
							</h1>
							<p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl mb-10">
								The refined game journal for adult gamers. Document your
								journey, curate your backlog, and reflect on your experiences
								with sophistication.
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Button size="lg" className="h-12 px-8 text-base">
									Start Your Journal
								</Button>
							</div>
						</div>
					</div>
					{/* Decorative Elements */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full max-w-[1000px] max-h-[1000px] bg-primary/5 rounded-full blur-3xl opacity-50 blur-[120px]"></div>
				</section>

				{/* Features Section */}
				<section className="py-20 bg-muted/30">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
								Focus on the Play
							</h2>
							<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
								Simple tools to capture your gaming life without the noise of
								social media or endless notifications.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
							<Card className="border-none shadow-sm transition-transform hover:scale-[1.02]">
								<CardHeader>
									<Gamepad2 className="h-10 w-10 text-primary mb-4" />
									<CardTitle>Backlog Curation</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Transform your overwhelming backlog into a curated list of
										experiences you actually want to play.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="border-none shadow-sm transition-transform hover:scale-[1.02]">
								<CardHeader>
									<Star className="h-10 w-10 text-primary mb-4" />
									<CardTitle>Deep Reviews</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Write meaningful reflections on the stories and mechanics
										that moved you.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-24">
					<div className="container mx-auto px-4">
						<div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
								Ready to start your journal?
							</h2>
							<p className="mx-auto max-w-[600px] text-lg text-primary-foreground/80 mb-10">
								Join a community of adult gamers who value their time and
								experiences.
							</p>
							<Button
								size="lg"
								variant="secondary"
								className="h-12 px-8 text-base font-semibold"
							>
								Get Started for Free
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
