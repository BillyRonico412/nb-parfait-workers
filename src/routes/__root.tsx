import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ModeToggle } from "@/components/ui/mode-toggle"

export const Route = createRootRoute({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
			<nav className="flex items-center gap-4 border-b pb-4">
				<h1 className="text-xl font-bold text-center">
					🧪 Expérimentation Web Worker
				</h1>
				<div className="ml-auto">
					<ModeToggle />
				</div>
			</nav>
			<p className="text-foreground/90">
				Cette application explore comment répartir des calculs intensifs (ex.
				recherche de nombres narcissique) entre plusieurs threads parallèles
				dans le navigateur, grâce aux Web Workers.
			</p>
			<p className="text-foreground/90">
				Un nombre narcissique est un nombre qui est égal à la somme de ses
				chiffres élevés à la puissance du nombre de chiffres.
			</p>
			<p>
				Par exemple, 153 = 1^3 + 5^3 + 3^3.
				<br />
				Ou encore, 9474 = 9^4 + 4^4 + 7^4 + 4^4.
			</p>
			<p className="text-foreground/90">
				L’objectif est de comparer les performances selon le nombre de threads
				utilisés et de visualiser en temps réel le travail de chaque thread.
			</p>
			<Outlet />
		</div>
	)
}
