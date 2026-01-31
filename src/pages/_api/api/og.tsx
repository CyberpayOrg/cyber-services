import { Handler } from "vocs/server";

export default function handler(request: Request) {
	return Handler.og(({ title, description }) => (
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
				padding: "60px 80px",
				fontFamily: "Inter, system-ui, sans-serif",
			}}
		>
			{/* Logo at top */}
			<div
				style={{
					position: "absolute",
					top: "60px",
					left: "80px",
					display: "flex",
					alignItems: "center",
				}}
			>
				<div
					style={{
						fontSize: 32,
						fontWeight: 500,
						color: "#3b82f6",
						letterSpacing: "-0.01em",
					}}
				>
					MPP
				</div>
			</div>

			{/* Blue accent line */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "4px",
					background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
				}}
			/>

			{/* Main content - centered */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "20px",
					textAlign: "center",
					maxWidth: "900px",
				}}
			>
				<div
					style={{
						fontSize: title.length < 20 ? 72 : title.length < 35 ? 56 : 48,
						fontWeight: 500,
						color: "#18181b",
						lineHeight: 1.1,
						letterSpacing: "-0.02em",
					}}
				>
					{title}
				</div>

				{description && (
					<div
						style={{
							fontSize: "26px",
							fontWeight: 400,
							color: "#71717a",
							lineHeight: 1.4,
						}}
					>
						{description.length > 100
							? `${description.slice(0, 100)}...`
							: description}
					</div>
				)}
			</div>

			{/* Subtle bottom decoration */}
			<div
				style={{
					position: "absolute",
					bottom: "60px",
					display: "flex",
					gap: "8px",
				}}
			>
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: "#3b82f6",
					}}
				/>
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: "#93c5fd",
					}}
				/>
				<div
					style={{
						width: "8px",
						height: "8px",
						borderRadius: "50%",
						backgroundColor: "#dbeafe",
					}}
				/>
			</div>
		</div>
	)).fetch(request);
}
