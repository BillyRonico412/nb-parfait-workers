import { createFileRoute, Link } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { atom, useAtomValue } from "jotai"
import {
	LucideChevronLeft,
	LucideHash,
	LucideRefreshCcw,
	LucideUsers,
	LucideZap,
} from "lucide-react"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Worker } from "@/components/Worker"
import { humanizeNumber } from "@/lib/utils"

const searchSchema = z.object({
	nbWorkers: z.number().min(1).max(navigator.hardwareConcurrency),
	maxNumber: z.number().min(1),
})

export const Route = createFileRoute("/result")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	loaderDeps({ search }) {
		return search
	},
	loader({ deps }) {
		const { nbWorkers } = deps
		const durationAtoms = Array.from({ length: nbWorkers }, () => atom(0))
		const averageTimeAtom = atom((get) => {
			const total = durationAtoms.reduce((sum, atom) => sum + get(atom), 0)
			return total / nbWorkers
		})
		return { durationAtoms, averageTimeAtom }
	},
})

function RouteComponent() {
	const { durationAtoms, averageTimeAtom } = Route.useLoaderData()
	const { maxNumber, nbWorkers } = Route.useSearch()
	const calculParWorker = Math.ceil(maxNumber / nbWorkers)
	const averageTime = useAtomValue(averageTimeAtom)

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
						{humanizeNumber(maxNumber)}
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
						{humanizeNumber(calculParWorker)}
					</span>
				</Card>
			</div>
			<div className="flex items-center justify-center gap-4">
				<Link to="/configuration" search={{ nbWorkers, maxNumber }}>
					<Button>
						<LucideChevronLeft size={18} />
						Changer de Configuration
					</Button>
				</Link>
				<Button onClick={() => window.location.reload()}>
					<LucideRefreshCcw size={18} />
					Recommencer
				</Button>
			</div>
			<div>
				<p className="text-2xl font-bold text-center">Workers</p>
				<div className="flex flex-col gap-4">
					{Array.from({ length: nbWorkers }, (_, i) => (
						<Worker key={i} numWorker={i} durationAtom={durationAtoms[i]} />
					))}
				</div>
			</div>
			<div>
				<p className="text-center">
					Temps moyen pour chaque Worker :{" "}
					<span className="font-semibold">
						{humanizeNumber(averageTime)} ms
					</span>
				</p>
			</div>
		</div>
	)
}
