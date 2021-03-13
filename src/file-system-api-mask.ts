/**
 * Core file system API layout that is required for 
 * this module to function effectively. 
 */
export interface FileSystemApiMask {
	write(data: string): Promise<void>;
}