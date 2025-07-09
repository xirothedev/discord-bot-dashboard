import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/utils";
import type { LogFilter } from "@/types/log";
import { Filter, Search, X } from "lucide-react";
import { useMemo, useRef } from "react";

interface LogFiltersProps {
  filters: LogFilter;
  onFiltersChange: (filters: LogFilter) => void;
  bots?: Array<{ id: number; name: string }>;
}

export function LogFilters({
  filters,
  onFiltersChange,
  bots,
}: LogFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = (key: keyof LogFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const debouncedSearch = useMemo(
    () => debounce((value: string) => handleFilterChange("search", value), 500),
    [filters]
  );

  const clearFilters = () => {
    onFiltersChange({});
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="cyber-gradient border cyber-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Log Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="outline"
                className="bg-purple-500/20 text-purple-400 border-purple-500/30"
              >
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
                className="hover:bg-red-500/10 hover:border-red-500/50 bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search logs..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-purple-500/50"
            />
          </div>
          {/* Bot Filter */}
          <div className="space-y-2 w-full md:w-64">
            <Select
              value={filters.botId || "all"}
              onValueChange={(value) =>
                handleFilterChange("botId", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50">
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
          <div className="space-y-2 w-full md:w-64">
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange("type", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50">
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
