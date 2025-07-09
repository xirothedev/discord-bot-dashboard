"use client";

// Inspired by react-hot-toast library
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useEffect, useState, useRef, useCallback } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
};

type ActionTypes = {
	ADD_TOAST: "ADD_TOAST";
	UPDATE_TOAST: "UPDATE_TOAST";
	DISMISS_TOAST: "DISMISS_TOAST";
	REMOVE_TOAST: "REMOVE_TOAST";
};

function genId(ref: React.MutableRefObject<number>) {
	ref.current = (ref.current + 1) % Number.MAX_SAFE_INTEGER;
	return ref.current.toString();
}

type Action =
	| {
			type: ActionTypes["ADD_TOAST"];
			toast: ToasterToast;
	  }
	| {
			type: ActionTypes["UPDATE_TOAST"];
			toast: Partial<ToasterToast>;
	  }
	| {
			type: ActionTypes["DISMISS_TOAST"];
			toastId?: ToasterToast["id"];
	  }
	| {
			type: ActionTypes["REMOVE_TOAST"];
			toastId?: ToasterToast["id"];
	  };

interface State {
	toasts: ToasterToast[];
}

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
			};

		case "DISMISS_TOAST": {
			const { toastId } = action;
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
							}
						: t,
				),
			};
		}
		case "REMOVE_TOAST":
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
	}
};

type Toast = Omit<ToasterToast, "id">;

export function useToast() {
	// Ref cho id generator
	const countRef = useRef(0);
	// State cho toasts
	const [toasts, setToasts] = useState<ToasterToast[]>([]);
	// Ref cho timeout
	const toastTimeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>());

	// Thay thế dispatch
	const localDispatch = useCallback((action: Action) => {
		setToasts((prevToasts) => {
			const state = { toasts: prevToasts };
			const nextState = reducer(state, action);
			return nextState.toasts;
		});
	}, []);

	// Hàm addToRemoveQueue local
	const addToRemoveQueue = useCallback(
		(toastId: string) => {
			if (toastTimeouts.current.has(toastId)) {
				return;
			}
			const timeout = setTimeout(() => {
				toastTimeouts.current.delete(toastId);
				localDispatch({ type: "REMOVE_TOAST", toastId });
			}, TOAST_REMOVE_DELAY);
			toastTimeouts.current.set(toastId, timeout);
		},
		[localDispatch],
	);

	// Hàm dismissToast local
	const dismissToast = useCallback(
		(toastId?: string) => {
			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				toasts.forEach((toast) => {
					addToRemoveQueue(toast.id);
				});
			}
			localDispatch({ type: "DISMISS_TOAST", toastId });
		},
		[addToRemoveQueue, localDispatch, toasts],
	);

	// Hàm toast local
	const toast = useCallback(
		({ ...props }: Toast) => {
			const id = genId(countRef);
			const update = (props: ToasterToast) =>
				localDispatch({
					type: "UPDATE_TOAST",
					toast: { ...props, id },
				});
			const dismiss = () => dismissToast(id);
			localDispatch({
				type: "ADD_TOAST",
				toast: {
					...props,
					id,
					open: true,
					onOpenChange: (open) => {
						if (!open) dismiss();
					},
				},
			});
			return {
				id: id,
				dismiss,
				update,
			};
		},
		[countRef, localDispatch, dismissToast],
	);

	// Cleanup timeout khi toast bị xóa
	useEffect(() => {
		return () => {
			toastTimeouts.current.forEach((timeout) => clearTimeout(timeout));
			toastTimeouts.current.clear();
		};
	}, []);

	return {
		toasts,
		toast,
		dismiss: (toastId?: string) => dismissToast(toastId),
	};
}

// Không export toast global nữa, chỉ export useToast (đã export ở trên)
