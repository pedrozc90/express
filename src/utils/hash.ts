import crypto from "crypto";

export function hash(content: string | Buffer): string {
	const hash = crypto.createHash("shake256");
	hash.update(content);
	return hash.digest("hex");
}
