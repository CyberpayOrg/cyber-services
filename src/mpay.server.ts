import { env } from "cloudflare:workers";
import { Mpay, tempo } from "mpay/server";

export const mpay = Mpay.create({
	method: tempo({ testnet: true }),
	realm: "mpp.dev",
	secretKey: env.SECRET_KEY! ?? "top-secret",
});
