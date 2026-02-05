import { useSyncExternalStore } from "react";

export type NetworkRequest = {
	description?: string;
	id: string;
	method: string;
	status: "pending" | "success" | "error";
	statusCode?: number;
	timestamp: number;
	url: string;
};

type Listener = () => void;

let requests: NetworkRequest[] = [];
const listeners = new Set<Listener>();

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

export const networkStore = {
	add(request: Omit<NetworkRequest, "id" | "timestamp">) {
		const id = crypto.randomUUID();
		requests = [
			...requests,
			{
				...request,
				id,
				timestamp: Date.now(),
			},
		];
		emit();
		return id;
	},

	update(id: string, updates: Partial<NetworkRequest>) {
		const index = requests.findIndex((r) => r.id === id);
		if (index !== -1) {
			requests = requests.map((r, i) =>
				i === index ? { ...r, ...updates } : r,
			);
			emit();
		}
	},

	clear() {
		requests = [];
		emit();
	},

	getSnapshot() {
		return requests;
	},

	subscribe(listener: Listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
};

export function useNetworkRequests() {
	return useSyncExternalStore(
		networkStore.subscribe,
		networkStore.getSnapshot,
		networkStore.getSnapshot,
	);
}

export function wrapFetch<
	fetch extends (...args: never[]) => Promise<Response>,
>(fetch: fetch): fetch {
	const wrapped = async (...args: Parameters<fetch>): Promise<Response> => {
		const [input, init] = args as unknown as [
			RequestInfo | URL,
			RequestInit | undefined,
		];
		const url = typeof input === "string" ? input : input.toString();
		const method = (init as RequestInit | undefined)?.method ?? "GET";

		const id = networkStore.add({
			method,
			status: "pending",
			url,
		});

		try {
			const response = await fetch(...args);
			const cloned = response.clone();

			let description: string | undefined;
			try {
				const contentType = cloned.headers.get("content-type") ?? "";
				if (contentType.includes("json")) {
					const json = (await cloned.json()) as { detail?: string };
					description =
						typeof json.detail === "string" && json.detail
							? json.detail
							: JSON.stringify(json);
				} else {
					description = await cloned.text();
				}
			} catch {}

			networkStore.update(id, {
				description,
				status: response.ok ? "success" : "error",
				statusCode: response.status,
			});
			return response;
		} catch (error) {
			networkStore.update(id, {
				status: "error",
			});
			throw error;
		}
	};
	return wrapped as fetch;
}
