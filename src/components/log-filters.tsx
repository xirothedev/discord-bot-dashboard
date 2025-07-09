import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { debounce } from "@/lib/utils";
import type { LogFilter } from "@/types/log";
import { Filter, Search, X } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";

interface LogFiltersProps {
	filters: LogFilter;
	onFiltersChange: (filters: LogFilter) => void;
	bots?: Array<{ id: number; name: string }>;
}

export function LogFilters({ filters, onFiltersChange, bots }: LogFiltersProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFilterChange = useCallback(
		(key: keyof LogFilter, value?: string) => {
			onFiltersChange({ ...filters, [key]: value });
		},
		[filters, onFiltersChange],
	);

	const debouncedSearch = useMemo(
		() => debounce((value: string) => handleFilterChange("search", value), 500),
		[handleFilterChange],
	);

	const clearFilters = () => {
		onFiltersChange({});
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const activeFiltersCount = Object.values(filters).filter(Boolean).length;

	return (
		<Card className="cyber-gradient cyber-border border">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-400">
						<Filter className="h-4 w-4" />
						Log Filters
						{activeFiltersCount > 0 && (
							<Badge variant="outline" className="border-purple-500/30 bg-purple-500/20 text-purple-400">
								{activeFiltersCount}
							</Badge>
						)}
					</CardTitle>
					<div className="flex items-center gap-2">
						{activeFiltersCount > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={clearFilters}
								className="bg-transparent hover:border-red-500/50 hover:bg-red-500/10"
							>
								<X className="mr-1 h-3 w-3" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
						<Input
							ref={inputRef}
							placeholder="Search logs..."
							onChange={(e) => debouncedSearch(e.target.value)}
							className="border-border/50 bg-background/50 pl-10 focus:border-purple-500/50"
						/>
					</div>
					{/* Bot Filter */}
					<div className="w-full space-y-2 md:w-64">
						<Select
							value={filters.botId || "all"}
							onValueChange={(value) => handleFilterChange("botId", value === "all" ? undefined : value)}
						>
							<SelectTrigger className="border-border/50 bg-background/50">
								<SelectValue placeholder="All Bots" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Bots</SelectItem>
								{bots?.map((bot) => (
									<SelectItem key={bot.id} value={bot.id.toString()}>
										{bot.name} - {bot.id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{/* Type Filter */}
					<div className="w-full space-y-2 md:w-64">
						<Select
							value={filters.type || "all"}
							onValueChange={(value) => handleFilterChange("type", value === "all" ? undefined : value)}
						>
							<SelectTrigger className="border-border/50 bg-background/50">
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="stdout">stdout</SelectItem>
								<SelectItem value="stderr">stderr</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
