import { LucideCheckCircle, LucideCpu } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { WorkerOutput } from "@/lib/narcissic.worker"
import NarcissicWorker from "@/lib/narcissic.worker?worker"
import { Route as ResultRoute } from "@/routes/result"

export const Worker = (props: { numWorker: number }) => {
	const { maxNumber, nbWorkers } = ResultRoute.useSearch()
	const totalCalcul = Math.ceil(maxNumber / nbWorkers)
	const [nbCalcul, setNbCalcul] = useState(0)
	const [isCompleted, setIsCompleted] = useState(false)
	const [foundNumbers, setFoundNumbers] = useState<number[]>([])
	const percent = Math.round((nbCalcul / totalCalcul) * 100)
	const startTime = useRef(Date.now())
	const endTime = useRef<number | null>(null)

	useEffect(() => {
		const worker = new NarcissicWorker()
		worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
			console.log(props.numWorker + 1)
			switch (event.data.type) {
				case "found": {
					const value = event.data.value
					setFoundNumbers((prev) => [...prev, value])
					break
				}
				case "done": {
					setIsCompleted(true)
					worker.terminate()
					endTime.current = Date.now()
					break
				}
				case "next": {
					const value = event.data.value
					setNbCalcul(value)
					break
				}
			}
		}
		worker.postMessage({
			numWorker: props.numWorker,
			nbWorkers,
			maxNumber,
		})
		return () => {
			worker.terminate()
		}
	}, [props.numWorker, nbWorkers, maxNumber])

	return (
		<Card className="px-4 py-2 flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className=" p-2 rounded-full">
						<LucideCpu size={18} />
					</div>
					<span className="font-semibold text-gray-800">
						Worker {props.numWorker + 1}
					</span>
				</div>
				{isCompleted && (
					<div className="flex items-center gap-1 text-green-600">
						<LucideCheckCircle size={18} />
						<span className="text-sm font-medium">Terminé</span>
					</div>
				)}
			</div>

			<div className="space-y-2">
				<Progress value={percent} className="h-2" />
				<div className="flex justify-between items-center">
					<span className="text-sm">
						{nbCalcul.toLocaleString()} / {totalCalcul.toLocaleString()}
					</span>
					<span className="text-sm font-medium">{percent}%</span>
				</div>
			</div>
			<div>
				{foundNumbers.length > 0 &&
					foundNumbers.map((number) => (
						<Badge key={number} className="mr-2 mb-2">
							{number.toLocaleString()}
						</Badge>
					))}
			</div>
			{isCompleted && endTime.current && (
				<div className="text-sm text-gray-600">
					Temps écoulé:{" "}
					{((endTime.current - startTime.current) / 1000).toFixed(2)}
					secondes
				</div>
			)}
		</Card>
	)
}
