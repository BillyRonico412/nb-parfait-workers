import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
			<h1 className="text-3xl font-bold text-center">
				🧪 Expérimentation Web Worker
			</h1>
			<p className="text-foreground/90">
				Cette application explore comment répartir des calculs intensifs (ex.
				recherche de nombres narcissique) entre plusieurs threads parallèles
				dans le navigateur, grâce aux Web Workers.
			</p>
			<p className="text-foreground/90">
				L’objectif est de comparer les performances selon le nombre de threads
				utilisés et de visualiser en temps réel le travail de chaque thread.
			</p>
			<Outlet />
		</div>
	)
}
