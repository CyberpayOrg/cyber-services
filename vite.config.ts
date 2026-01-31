import nodeLoaderCloudflare from "@hiogawa/node-loader-cloudflare/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vocs } from "vocs/vite";

export default defineConfig({
	css: {
		preprocessorOptions: {
			css: {
				additionalData: '@import "./src/styles.css";',
			},
		},
	},
	optimizeDeps: {
		include: ["@braintree/sanitize-url", "dayjs", "mermaid"],
	},
	plugins: [
		nodeLoaderCloudflare({
			environments: ["rsc"],
			build: true,
			// https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
			getPlatformProxyOptions: {
				persist: {
					path: ".wrangler/state/v3",
				},
			},
		}),
		react(),
		vocs({
			unstable_adapter: "waku/adapters/cloudflare",
		}),
	],
});
