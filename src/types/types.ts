export type HealthCheck = {
	env: string;
	timezone: string;
	timestamp: Date;
	timestamp_locale: string;
	app: {
		name: string;
		version: string;
	};
};

export type HealthCheckArgs = {
	name: string;
	version: string;
	env: string;
	timestamp?: Date;
};

export function createHealthCheck({ name, version, env = "development", timestamp = new Date() }: HealthCheckArgs): HealthCheck {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const formatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 3,
		hour12: false,
		timeZone: timezone,
	});

	const parts = Object.fromEntries(formatter.formatToParts(timestamp).map(({ type, value }) => [type, value]));
	console.log("parts", parts);

	return {
		env,
		timestamp,
		timestamp_locale: "none", // `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}`,
		timezone,
		app: {
			name,
			version,
		},
	};
}
