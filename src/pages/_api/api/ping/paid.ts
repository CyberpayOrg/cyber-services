import { mpay } from "../../../../mpay.server";

export async function GET(request: Request) {
	const result = await mpay.stream({
		amount: "0.1",
		unitType: "token",
	})(request);

	if (result.status === 402) return result.challenge;

	return result.withReceipt(new Response("tm! thanks for paying"));
}
