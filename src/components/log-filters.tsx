"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar } from "lucide-react";
import type { LogFilter } from "@/types/log";

interface LogFiltersProps {
  filters: LogFilter;
  onFiltersChange: (filters: LogFilter) => void;
  botOptions: Array<{ id: string; name: string }>;
}

export function LogFilters({
  filters,
  onFiltersChange,
  botOptions,
}: LogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof LogFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const levelOptions = [
    { value: "info", label: "Info", color: "text-blue-400" },
    { value: "warn", label: "Warning", color: "text-yellow-400" },
    { value: "error", label: "Error", color: "text-red-400" },
    { value: "debug", label: "Debug", color: "text-gray-400" },
    { value: "success", label: "Success", color: "text-green-400" },
  ];

  const categoryOptions = [
    { value: "system", label: "System", icon: "⚙️" },
    { value: "command", label: "Command", icon: "⚡" },
    { value: "error", label: "Error", icon: "❌" },
    { value: "user", label: "User", icon: "👤" },
    { value: "api", label: "API", icon: "🔗" },
    { value: "database", label: "Database", icon: "💾" },
  ];

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-purple-500/10 hover:border-purple-500/50"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-purple-500/50"
          />
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bot Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bot</Label>
              <Select
                value={filters.botId || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "botId",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="All Bots" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bots</SelectItem>
                  {botOptions.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Level</Label>
              <Select
                value={filters.level || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "level",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levelOptions.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "category",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Time Range
              </Label>
              <Select defaultValue="24h">
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
