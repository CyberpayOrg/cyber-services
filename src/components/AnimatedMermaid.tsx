"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface AnimationStep {
	selector?: string;
	index?: Record<string, number[]>;
	description: string;
}

interface AnimatedMermaidProps {
	src: string;
	steps: AnimationStep[];
	autoPlayInterval?: number;
}

export function AnimatedMermaid({
	src,
	steps,
	autoPlayInterval = 0,
}: AnimatedMermaidProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentStep, setCurrentStep] = useState(-1);
	const [isPlaying, setIsPlaying] = useState(false);
	const [svgContent, setSvgContent] = useState<string | null>(null);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) =>
			setPrefersReducedMotion(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetch(src, { signal: controller.signal })
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to fetch ${src}`);
				return res.text();
			})
			.then((svg) => setSvgContent(svg))
			.catch((err) => {
				if (err.name !== "AbortError") {
					console.error("Failed to load diagram:", err);
				}
			});
		return () => controller.abort();
	}, [src]);

	const getStepElements = useCallback(
		(svg: SVGElement, step: AnimationStep): Element[] => {
			const elements: Element[] = [];
			if (step.selector) {
				elements.push(...Array.from(svg.querySelectorAll(step.selector)));
			}
			if (step.index) {
				for (const [className, indices] of Object.entries(step.index)) {
					const allOfClass = Array.from(svg.querySelectorAll(`.${className}`));
					for (const idx of indices) {
						if (allOfClass[idx]) {
							elements.push(allOfClass[idx]);
						}
					}
				}
			}
			return elements;
		},
		[],
	);

	// Apply custom colors to specific message text elements
	useEffect(() => {
		if (!containerRef.current || !svgContent) return;
		const svg = containerRef.current.querySelector("svg");
		if (!svg) return;

		const messageTexts = svg.querySelectorAll("text.messageText");
		// Text indices: 0=(1), 1=(2), 2=WWW-Auth, 3=(4), 4=Auth, 5=(6), 6=Payment-Receipt
		// Color (2) 402 response text red (indices 1, 2)
		// Color (6) 200 OK response text green (indices 5, 6)
		messageTexts.forEach((el, i) => {
			if (i === 1 || i === 2) {
				(el as HTMLElement).style.fill = "#b97676"; // muted coral rose
			} else if (i === 5 || i === 6) {
				(el as HTMLElement).style.fill = "#5b9a76"; // muted sage green
			}
		});
	}, [svgContent]);

	useEffect(() => {
		if (!containerRef.current || !svgContent) return;
		const svg = containerRef.current.querySelector("svg");
		if (!svg) return;

		const allElements = svg.querySelectorAll(
			".actor, .actor-box, .actor-line, .messageLine0, .messageLine1, .messageText, .note, .noteText, rect, line, text",
		);

		// When currentStep is -1, show everything at full opacity
		if (currentStep === -1) {
			for (let i = 0; i < allElements.length; i++) {
				const el = allElements[i] as HTMLElement;
				el.style.opacity = "1";
				el.style.transition = "opacity 0.3s ease";
			}
			return;
		}

		// Otherwise animate steps
		for (let i = 0; i < allElements.length; i++) {
			const el = allElements[i] as HTMLElement;
			el.style.opacity = "0.15";
			el.style.transition = "opacity 0.3s ease";
		}

		for (let i = 0; i <= currentStep; i++) {
			const step = steps[i];
			const elements = getStepElements(svg, step);
			const opacity = i === currentStep ? "1" : "0.4";
			for (let j = 0; j < elements.length; j++) {
				(elements[j] as HTMLElement).style.opacity = opacity;
			}
		}
	}, [currentStep, svgContent, steps, getStepElements]);

	useEffect(() => {
		if (!isPlaying || autoPlayInterval === 0 || prefersReducedMotion) return;
		const interval = setInterval(() => {
			setCurrentStep((prev) => {
				if (prev >= steps.length - 1) {
					setIsPlaying(false);
					return prev;
				}
				return prev + 1;
			});
		}, autoPlayInterval);
		return () => clearInterval(interval);
	}, [isPlaying, autoPlayInterval, steps.length, prefersReducedMotion]);

	const handlePlay = useCallback(() => {
		if (prefersReducedMotion) {
			if (currentStep === -1) setCurrentStep(0);
			return;
		}
		if (currentStep >= steps.length - 1 || currentStep === -1) {
			setCurrentStep(0);
		}
		setIsPlaying(true);
	}, [currentStep, steps.length, prefersReducedMotion]);

	const handlePrev = useCallback(() => {
		setIsPlaying(false);
		setCurrentStep((prev) => Math.max(0, prev - 1));
	}, []);

	const handleNext = useCallback(() => {
		setIsPlaying(false);
		setCurrentStep((prev) => {
			if (prev === -1) return 0;
			return Math.min(steps.length - 1, prev + 1);
		});
	}, [steps.length]);

	const handleReset = useCallback(() => {
		setIsPlaying(false);
		setCurrentStep(-1);
	}, []);

	if (!svgContent) {
		return (
			<div
				style={{
					minHeight: "200px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#9ca3af",
				}}
			>
				Loading diagram...
			</div>
		);
	}

	const isAnimating = currentStep >= 0;

	return (
		<div style={{ position: "relative", margin: "1.5rem 0", width: "100%" }}>
			{isAnimating && (
				<button
					type="button"
					onClick={handleReset}
					aria-label="Show full diagram"
					style={{
						position: "absolute",
						top: "0.5rem",
						right: "0.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "28px",
						height: "28px",
						border: "1px solid #e5e7eb",
						borderRadius: "6px",
						background: "#fff",
						color: "#6b7280",
						cursor: "pointer",
						padding: 0,
						zIndex: 10,
					}}
				>
					<svg
						aria-hidden="true"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</svg>
				</button>
			)}
			<div
				ref={containerRef}
				style={{
					display: "flex",
					justifyContent: "center",
					overflow: "hidden",
				}}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted build
				dangerouslySetInnerHTML={{ __html: svgContent }}
			/>

			{isAnimating && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: "1rem",
					}}
				>
					<div
						style={{
							textAlign: "center",
							padding: "0.75rem 1.5rem",
							fontSize: "0.875rem",
							color: "#6b7280",
							background: "#f9fafb",
							borderRadius: "8px",
							border: "1px solid #e5e7eb",
							maxWidth: "480px",
						}}
						aria-live="polite"
						aria-atomic="true"
					>
						{steps[currentStep]?.description}
					</div>
				</div>
			)}

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "0.75rem",
					marginTop: "1rem",
					width: "100%",
				}}
			>
				{isAnimating && (
					<button
						type="button"
						onClick={handlePrev}
						disabled={currentStep <= 0}
						aria-label="Previous step"
						style={{ ...btnStyle, opacity: currentStep <= 0 ? 0.4 : 1 }}
					>
						<svg
							aria-hidden="true"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>
				)}
				<button
					type="button"
					onClick={
						isAnimating
							? isPlaying
								? () => setIsPlaying(false)
								: handlePlay
							: handlePlay
					}
					aria-label={
						isAnimating
							? isPlaying
								? "Pause animation"
								: "Resume animation"
							: "Play step-by-step animation"
					}
					style={primaryBtnStyle}
				>
					{isPlaying ? (
						<svg
							aria-hidden="true"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					) : (
						<svg
							aria-hidden="true"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
					)}
				</button>
				{isAnimating && (
					<button
						type="button"
						onClick={handleNext}
						disabled={currentStep >= steps.length - 1}
						aria-label="Next step"
						style={{
							...btnStyle,
							opacity: currentStep >= steps.length - 1 ? 0.4 : 1,
						}}
					>
						<svg
							aria-hidden="true"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				)}
			</div>

			{isAnimating && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "6px",
						marginTop: "0.75rem",
						width: "100%",
					}}
					role="group"
					aria-label="Animation steps"
				>
					{steps.map((step, i) => (
						<button
							type="button"
							key={`dot-${i}`}
							onClick={() => {
								setIsPlaying(false);
								setCurrentStep(i);
							}}
							aria-label={`Go to step ${i + 1}: ${step.description}`}
							aria-current={i === currentStep ? "step" : undefined}
							style={{
								width: "6px",
								height: "6px",
								borderRadius: "50%",
								border: "none",
								background:
									i === currentStep
										? "#3b82f6"
										: i < currentStep
											? "#93c5fd"
											: "#d1d5db",
								cursor: "pointer",
								padding: 0,
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}

const btnStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "36px",
	height: "36px",
	border: "1px solid #e5e7eb",
	borderRadius: "50%",
	background: "#fff",
	color: "#6b7280",
	cursor: "pointer",
	padding: 0,
};

const primaryBtnStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "44px",
	height: "44px",
	border: "none",
	borderRadius: "50%",
	background: "#3b82f6",
	color: "#fff",
	cursor: "pointer",
	padding: 0,
};
