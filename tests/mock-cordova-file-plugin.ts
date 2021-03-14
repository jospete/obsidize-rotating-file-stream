import {
	CordovaDirectoryEntryLike,
	CordovaFileEntryLike,
	CordovaFileEntryMetadataLike,
	CordovaFileFlags,
	CordovaFilePluginLike,
	CordovaFileWriteOptions
} from '../src';

export class MockCordovaFileEntry implements CordovaFileEntryLike {

	isFile: boolean = true;
	isDirectory: boolean = false;
	name: string = '';
	fullPath: string = '';
	metadata: CordovaFileEntryMetadataLike = { modificationTime: new Date(), size: 0 };

	getMetadata(successCallback: (metadata: CordovaFileEntryMetadataLike) => void): void {
		successCallback(this.metadata);
	}

	toURL(): string {
		return this.fullPath;
	}
}

export class MockCordovaDirectoryEntry implements CordovaDirectoryEntryLike {

	isFile: boolean = false;
	isDirectory: boolean = true;
	name: string = '';
	fullPath: string = '';
	metadata: CordovaFileEntryMetadataLike = { modificationTime: new Date(), size: 0 };

	getMetadata(successCallback: (metadata: CordovaFileEntryMetadataLike) => void): void {
		successCallback(this.metadata);
	}

	toURL(): string {
		return this.fullPath;
	}
}

export class MockCordovaFilePlugin implements CordovaFilePluginLike {

	cacheDirectory: string = 'cache';
	tempDirectory: string = 'tmp';
	sharedDirectory: string = 'shared';

	public async resolveDirectoryUrl(directoryUrl: string): Promise<CordovaDirectoryEntryLike> {
		const result = new MockCordovaDirectoryEntry();
		result.fullPath = directoryUrl;
		return result;
	}

	public async getDirectory(directoryEntry: CordovaDirectoryEntryLike, directoryName: string, flags: CordovaFileFlags): Promise<CordovaDirectoryEntryLike> {
		const result = new MockCordovaDirectoryEntry();
		result.fullPath = directoryEntry.fullPath + directoryName;
		return result;
	}

	public async getFile(directoryEntry: CordovaDirectoryEntryLike, fileName: string, flags: CordovaFileFlags): Promise<CordovaFileEntryLike> {
		const result = new MockCordovaFileEntry();
		result.fullPath = directoryEntry.fullPath + fileName;
		return result;
	}

	public async readAsArrayBuffer(path: string, fileName: string): Promise<ArrayBuffer> {
		return null;
	}

	public async writeFile(path: string, fileName: string, text: string | Blob | ArrayBuffer, options?: CordovaFileWriteOptions): Promise<any> {
		return true;
	}
}