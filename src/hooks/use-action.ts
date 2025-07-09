import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface ActionPayload {
	action: "start" | "stop" | "restart";
	pm_id: number;
}

export function useAction(options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) {
	return useMutation({
		mutationFn: async (payload: ActionPayload) => {
			const res = await axios.post("/api/actions", payload);
			return res.data;
		},
		onSuccess: (data) => {
			toast({
				title: "Successful",
				description: data.result || "Do action successful!",
			});
		},
		onError: (error: AxiosError<string>) => {
			toast({
				title: "Error",
				description: error?.response?.data || error.message || "An error occurred!",
				variant: "destructive",
			});
		},
	});
}
