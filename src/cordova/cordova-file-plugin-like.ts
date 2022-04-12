export interface RFSCordovaFileEntryMetadataLike {
	modificationTime: Date;
	size: number;
}

export interface RFSCordovaFileWriteOptions {
	replace?: boolean;
	append?: boolean;
	truncate?: number;
}

export interface RFSCordovaFileFlags {
	create?: boolean;
	exclusive?: boolean;
}

export interface RFSCordovaEntryLike {
	isFile: boolean;
	isDirectory: boolean;
	name: string;
	fullPath: string;
	getMetadata(successCallback: (metadata: RFSCordovaFileEntryMetadataLike) => void, errorCallback?: (error: any) => void): void;
	toURL(): string;
}

export interface RFSCordovaFileEntryLike extends RFSCordovaEntryLike {
}

export interface RFSCordovaDirectoryEntryLike extends RFSCordovaEntryLike {
}

/**
 * Partial interface to integrate with the 
 * [@awesome-cordova-plugins/file](https://www.npmjs.com/package/@awesome-cordova-plugins/file) 
 * module.
 */
export interface CordovaFilePluginLike {

	cacheDirectory: string;
	tempDirectory: string;
	sharedDirectory: string;

	resolveDirectoryUrl(directoryUrl: string): Promise<RFSCordovaDirectoryEntryLike>;
	getDirectory(directoryEntry: RFSCordovaDirectoryEntryLike, directoryName: string, flags: RFSCordovaFileFlags): Promise<RFSCordovaDirectoryEntryLike>;
	getFile(directoryEntry: RFSCordovaDirectoryEntryLike, fileName: string, flags: RFSCordovaFileFlags): Promise<RFSCordovaFileEntryLike>;
	writeFile(path: string, fileName: string, text: string | Blob | ArrayBuffer, options?: RFSCordovaFileWriteOptions): Promise<any>;
	readAsArrayBuffer(path: string, file: string): Promise<ArrayBuffer>;
}