import { type PrimitiveAtom, useAtom } from "jotai"
import { LucideCheckCircle, LucideCpu, LucideLoader } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { WorkerOutput } from "@/lib/narcissic.worker"
import NarcissicWorker from "@/lib/narcissic.worker?worker"
import { humanizeNumber } from "@/lib/utils"
import { Route as ResultRoute } from "@/routes/result"

export const Worker = (props: {
	numWorker: number
	durationAtom: PrimitiveAtom<number>
}) => {
	const { maxNumber, nbWorkers } = ResultRoute.useSearch()
	const [isCompleted, setIsCompleted] = useState(false)
	const [foundNumbers, setFoundNumbers] = useState<number[]>([])
	const startTime = useRef(Date.now())
	const endTime = useRef<number | null>(null)
	const [duration, setDuration] = useAtom(props.durationAtom)

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
					setDuration(endTime.current - startTime.current)
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
	}, [props.numWorker, nbWorkers, maxNumber, setDuration])

	return (
		<Card className="px-4 py-2 flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className=" p-2 rounded-full">
						<LucideCpu size={18} />
					</div>
					<span className="font-semibold">Worker {props.numWorker + 1}</span>
				</div>
				{isCompleted ? (
					<div className="flex items-center gap-1 text-green-600">
						<LucideCheckCircle size={18} />
						<span className="text-sm font-medium">Terminé</span>
					</div>
				) : (
					<div className="flex items-center gap-1 text-yellow-600">
						<LucideLoader size={18} className="animate-spin" />
						<span className="text-sm font-medium">En cours</span>
					</div>
				)}
			</div>
			<div>
				{foundNumbers.length > 0 &&
					foundNumbers.map((number) => (
						<Badge key={number} className="mr-2 mb-2">
							{humanizeNumber(number)}
						</Badge>
					))}
			</div>
			{isCompleted && (
				<div className="text-sm text-muted-foreground">
					Temps écoulé: {humanizeNumber(duration)} ms
				</div>
			)}
		</Card>
	)
}
