import { ServerSettings } from "../types";

const env: string = process.env["NODE_ENV"] || "development";
const production: boolean = env === "production";
const development: boolean = !production;

export const settings: ServerSettings = {
	__dirname: import.meta.dirname,
	name: process.env["APP_NAME"] || "default",
	version: process.env["APP_VERSION"] || "none",
	env,
	production,
	development,
	http: {
		port: Number(process.env["PORT"]) || 9000,
		https: false,
	},
};
