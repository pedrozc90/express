export interface ServerSettings {
	__dirname: string;
	name: string;
	version: string;
	env: string | "development" | "production" | "test" | "stage";
	production: boolean;
	development: boolean;
	http: {
		host?: string;
		port: number;
		https: boolean;
	};
	jwt?: {
		secret?: string;
		expiration?: string | number;
	};
}
