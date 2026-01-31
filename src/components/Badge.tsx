import type { ReactNode } from "react";

type BadgeVariant =
	| "default"
	| "success"
	| "warning"
	| "info"
	| "purple"
	| "danger";

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
	default: { bg: "#e5e7eb", text: "#374151" },
	success: { bg: "#dcfce7", text: "#166534" },
	warning: { bg: "#fef3c7", text: "#92400e" },
	info: { bg: "#dbeafe", text: "#1e40af" },
	purple: { bg: "#f3e8ff", text: "#7c3aed" },
	danger: { bg: "#fee2e2", text: "#991b1b" },
};

export function Badge({
	children,
	variant = "default",
}: {
	children: ReactNode;
	variant?: BadgeVariant;
}) {
	const styles = variantStyles[variant];
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				padding: "2px 10px",
				fontSize: "12px",
				fontWeight: 500,
				borderRadius: "9999px",
				backgroundColor: styles.bg,
				color: styles.text,
				whiteSpace: "nowrap",
			}}
		>
			{children}
		</span>
	);
}
