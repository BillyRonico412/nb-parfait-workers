import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { LucidePlay } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const nbWorkersOptions = Array.from(
	{ length: navigator.hardwareConcurrency || 4 },
	(_, i) => i + 1,
)
const maxNumberOptions = Array.from({ length: 10 }, (_, i) => 1000 * 10 ** i)

const formSchema = z.object({
	nbWorkers: z.number(),
	maxNumber: z.number(),
})

const humnanizeNumber = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_")
}

const searchSchema = z.object({
	nbWorkers: z.number().min(1).max(navigator.hardwareConcurrency).optional(),
	maxNumber: z.number().min(1).optional(),
})

export const Route = createFileRoute("/configuration")({
	validateSearch: zodValidator(searchSchema),
	component: RouteComponent,
})

function RouteComponent() {
	const search = Route.useSearch()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nbWorkers: search.nbWorkers ?? 4,
			maxNumber: search.maxNumber ?? 10_000_000,
		},
	})
	const navigate = useNavigate()
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					form.reset()
					navigate({
						to: "/result",
						search: { nbWorkers: data.nbWorkers, maxNumber: data.maxNumber },
					})
				})}
			>
				<Card>
					<CardHeader>
						<CardTitle>Configuration des Workers</CardTitle>
						<CardDescription className="space-y-2">
							<p>
								Choisissez le nombre de Workers et le nombre maximum à vérifier
								pour les nombres parfaits.
							</p>
							<p>
								Les Workers vont chercher les nombres parfaits en parallèle, et
								les résultats seront affichés en temps réel.
							</p>
							<p>
								Chaque worker va traiter le nombre{" "}
								<span className="font-medium">nbWorkers * i + numWorker</span>,
								où i est un entier positif.
							</p>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							name="nbWorkers"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre de Workers</FormLabel>
									<Select
										value={String(field.value)}
										onValueChange={(value) => field.onChange(Number(value))}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Nombre de Workers" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{nbWorkersOptions.map((value) => (
												<SelectItem key={value} value={String(value)}>
													{value} Worker{value > 1 ? "s" : ""}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<FormField
							name="maxNumber"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre maximum à vérifier</FormLabel>
									<Select
										value={String(field.value)}
										onValueChange={(value) => field.onChange(Number(value))}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Nombre maximum" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{maxNumberOptions.map((value) => (
												<SelectItem key={value} value={String(value)}>
													Jusqu'à {humnanizeNumber(value)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<Button type="submit">
							<LucidePlay />
							Démarrer la recherche
						</Button>
					</CardContent>
				</Card>
			</form>
		</Form>
	)
}
