import { env } from "cloudflare:workers";
import { Json } from "ox";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const payer = url.searchParams.get("payer");
	if (!payer) return Response.json({ error: "Missing payer" }, { status: 400 });

	const kv = env.MPAY_KV;
	const list = await kv.list({ prefix: "channel:" });

	let spent = 0n;
	for (const key of list.keys) {
		const raw = await kv.get(key.name);
		if (!raw) continue;
		const channel = Json.parse(raw) as {
			payer?: string;
			highestVoucherAmount?: bigint;
		};
		if (channel.payer?.toLowerCase() !== payer.toLowerCase()) continue;
		spent += channel.highestVoucherAmount ?? 0n;
	}

	return Response.json({ spent: spent.toString() });
}
