/// <reference lib="webworker" />

export default {}

const isNarcissic = (n: number) => {
	const digits = n.toString().split("").map(Number)
	const sum = digits.reduce((acc, digit) => acc + digit ** digits.length, 0)
	return sum === n
}

export type WorkerOutput =
	| { type: "found"; value: number }
	| { type: "done" }
	| { type: "next"; value: number }

export type WorkerInput = {
	numWorker: number
	nbWorkers: number
	maxNumber: number
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
	const { numWorker, nbWorkers, maxNumber } = event.data
	let nb = numWorker
	if (nb === 0) {
		nb = nbWorkers
	}
	while (nb <= maxNumber) {
		if (isNarcissic(nb)) {
			self.postMessage({ type: "found", value: nb } satisfies WorkerOutput)
		}
		nb += nbWorkers
	}
	return self.postMessage({ type: "done" } satisfies WorkerOutput)
}
