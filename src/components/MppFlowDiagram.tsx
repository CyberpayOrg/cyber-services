import { AnimatedMermaid, type AnimationStep } from "./AnimatedMermaid";

// Animation steps for the MPP protocol flow diagram
// The SVG has: .actor (boxes), .actor-line (vertical lines), .messageLine0 (solid arrows),
// .messageLine1 (dashed arrows), .messageText (labels), .note/.noteText (notes)
const steps: AnimationStep[] = [
	{
		// Participant boxes (Client, Server) - both top and bottom
		selector: ".actor, .actor-box, .actor-line",
		description: "Client and Server are the two participants in the MPP flow",
	},
	{
		// First solid arrow (GET /resource) and its text
		// Using index-based selectors for message lines and texts
		index: { messageLine0: [0], messageText: [0] },
		description: "Client sends initial request: GET /resource",
	},
	{
		// First dashed arrow (402 response) and its texts
		index: { messageLine1: [0], messageText: [1, 2] },
		description:
			"Server responds with 402 Payment Required and a challenge in WWW-Authenticate",
	},
	{
		// First note (client fulfills payment)
		index: { note: [0], noteText: [0, 1] },
		description:
			"Client fulfills the payment challenge (signs transaction, pays invoice, etc.)",
	},
	{
		// Second solid arrow (retry with credential) and its texts
		index: { messageLine0: [1], messageText: [3, 4] },
		description: "Client retries request with Authorization credential",
	},
	{
		// Second note (server verifies) + second dashed arrow (200 OK) and texts
		index: { note: [1], noteText: [2], messageLine1: [1], messageText: [5, 6] },
		description: "Server verifies payment and returns 200 OK with a receipt",
	},
];

export function MppFlowDiagram() {
	return (
		<AnimatedMermaid
			src="/diagrams/mpp-flow.svg"
			steps={steps}
			autoPlayInterval={2500}
		/>
	);
}
