/**
 * Used by RotatingFileStream to make write transactions 
 * and determine when to rotate files.
 */
export interface FileEntryLike {
	toURL(): string;
	getLastModificationTime(): number;
}

/**
 * Core file system API layout that is required for 
 * this module to function effectively. 
 */
export interface FileSystemApiMask {
	write(entry: FileEntryLike, data: ArrayBuffer): Promise<void>;
	refreshEntry(entry: FileEntryLike): Promise<FileEntryLike>;
}