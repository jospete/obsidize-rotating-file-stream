export interface CordovaFileEntryMetadataLike {
	modificationTime: Date;
	size: number;
}

export interface CordovaFileWriteOptions {
	replace?: boolean;
	append?: boolean;
	truncate?: number;
}

export interface CordovaFileFlags {
	create?: boolean;
	exclusive?: boolean;
}

export interface CordovaEntryLike {
	isFile: boolean;
	isDirectory: boolean;
	name: string;
	fullPath: string;
	getMetadata(successCallback: (metadata: CordovaFileEntryMetadataLike) => void, errorCallback?: (error: any) => void): void;
	toURL(): string;
}

export interface CordovaFileEntryLike extends CordovaEntryLike {
}

export interface CordovaDirectoryEntryLike extends CordovaEntryLike {
}

export interface CordovaFilePluginLike {

	cacheDirectory: string;
	tempDirectory: string;
	sharedDirectory: string;

	resolveDirectoryUrl(directoryUrl: string): Promise<CordovaDirectoryEntryLike>;
	getDirectory(directoryEntry: CordovaDirectoryEntryLike, directoryName: string, flags: CordovaFileFlags): Promise<CordovaDirectoryEntryLike>;
	getFile(directoryEntry: CordovaDirectoryEntryLike, fileName: string, flags: CordovaFileFlags): Promise<CordovaFileEntryLike>;
	writeFile(path: string, fileName: string, text: string | Blob | ArrayBuffer, options?: CordovaFileWriteOptions): Promise<any>;
}