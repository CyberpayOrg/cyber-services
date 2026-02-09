import { mpay } from "../../../../mpay.server";

export async function GET(request: Request) {
	const result = await mpay.stream({
		amount: "0.001",
		unitType: "llm_token",
	})(request);

	if (result.status === 402) return result.challenge;

	return result.withReceipt(
		Response.json({
			location: {
				lat: 37.7749,
				lng: -122.4194,
				city: "San Francisco",
				region: "CA",
				country: "US",
			},
			cost: "$0.001",
		}),
	);
}
