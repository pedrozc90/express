export type FileStorage = {
	filepath?: string;
	filename: string;
	extension: string;
	content_type: string;
	content: Buffer;
	size: number;
};
