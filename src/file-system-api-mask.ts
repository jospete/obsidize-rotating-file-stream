

export interface FileSystemApiMask {
	write(data: string): Promise<void>;
}