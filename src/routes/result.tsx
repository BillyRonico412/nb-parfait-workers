import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { LucideHash, LucideUsers, LucideZap } from "lucide-react"
import z from "zod"
import { Card } from "@/components/ui/card"
import { Worker } from "@/components/Worker"

const searchSchema = z.object({
	nbWorkers: z.number().min(1).max(navigator.hardwareConcurrency),
	maxNumber: z.number().min(1),
})

export const Route = createFileRoute("/result")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
})

function RouteComponent() {
	const { maxNumber, nbWorkers } = Route.useSearch()
	const calculParWorker = Math.ceil(maxNumber / nbWorkers)

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
			<h1 className="text-2xl font-bold text-center mb-2">
				Résultats de Configuration
			</h1>
			<p className="text-center">Paramètres de calcul des nombres parfaits</p>

			<div className="flex flex-col gap-4">
				<Card className="px-4 py-2 flex flex-row items-center">
					<div className="flex items-center gap-4">
						<div className="p-2 rounded-full ">
							<LucideUsers size={18} />
						</div>
						<p className="font-semibold">Workers</p>
					</div>
					<span className="ml-auto text-xl font-bold">{nbWorkers}</span>
				</Card>

				<Card className="px-4 py-2 flex flex-row items-center">
					<div className="flex items-center gap-4">
						<div className="p-2 rounded-full">
							<LucideHash size={18} />
						</div>
						<p className="font-semibold ">Nombre Maximum</p>
					</div>
					<span className="ml-auto text-xl font-bold ">
						{maxNumber.toLocaleString()}
					</span>
				</Card>

				<Card className="px-4 py-2 flex flex-row items-center">
					<div className="flex items-center gap-4">
						<div className="p-2 rounded-full">
							<LucideZap size={18} />
						</div>
						<p className="font-semibold ">Calculs par Worker</p>
					</div>
					<span className="ml-auto text-xl font-bold ">
						{calculParWorker.toLocaleString()}
					</span>
				</Card>
			</div>
			<div>
				<p className="text-2xl font-bold text-center">Workers</p>
				<div className="flex flex-col gap-4">
					{Array.from({ length: nbWorkers }, (_, i) => (
						<Worker key={i} numWorker={i} />
					))}
				</div>
			</div>
		</div>
	)
}
