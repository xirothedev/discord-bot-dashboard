import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Debounce utility: delays invoking a function until after wait ms have elapsed since the last call
export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};
}

export function calculateCpuUsagePercent(loadAverage: number[] | undefined, cpuCount: number | undefined): number {
	if (Array.isArray(loadAverage) && loadAverage.length > 0 && cpuCount) {
		return Number(((loadAverage[0] * 100) / cpuCount).toFixed(2));
	}
	return 0;
}

export function calculateMemoryUsagePercent(used: number | undefined, total: number | undefined): number {
	if (typeof used === "number" && typeof total === "number" && total > 0) {
		return Number(((used / total) * 100).toFixed(2));
	}
	return 0;
}
