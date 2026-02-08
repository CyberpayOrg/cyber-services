import { Fetch, tempo } from "mpay/client";
import { wrapFetch } from "./lib/network-store";
import { config } from "./wagmi.config";

const trackedFetch = wrapFetch(globalThis.fetch);

export const fetch = Fetch.from({
	fetch: trackedFetch,
	methods: [
		tempo.charge({
			client(chainId) {
				return config.getClient({ chainId: chainId as never });
			},
		}),
	],
});
