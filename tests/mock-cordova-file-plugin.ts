import {
	CordovaDirectoryEntryLike,
	CordovaFileEntryLike,
	CordovaFileEntryMetadataLike,
	CordovaFileFlags,
	CordovaFilePluginLike,
	CordovaFileWriteOptions
} from '../src';
import { bufferFrom, bufferConcat } from './util';

export class MockCordovaFileEntry implements CordovaFileEntryLike {

	isFile: boolean = true;
	isDirectory: boolean = false;
	name: string = '';
	fullPath: string = '';
	metadata: CordovaFileEntryMetadataLike = { modificationTime: new Date(), size: 0 };
	data: ArrayBuffer = null;

	getMetadata(successCallback: (metadata: CordovaFileEntryMetadataLike) => void): void {
		setTimeout(() => successCallback(this.metadata), 0);
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
		setTimeout(() => successCallback(this.metadata), 0);
	}

	toURL(): string {
		return this.fullPath;
	}
}

export class MockCordovaFilePlugin implements CordovaFilePluginLike {

	cacheDirectory: string = 'cache';
	tempDirectory: string = 'tmp';
	sharedDirectory: string = 'shared';

	readonly dirMap: Map<string, MockCordovaDirectoryEntry> = new Map();
	readonly fileMap: Map<string, MockCordovaFileEntry> = new Map();

	public async resolveDirectoryUrl(directoryUrl: string): Promise<CordovaDirectoryEntryLike> {

		let result = this.dirMap.get(directoryUrl);

		if (!result) {
			result = new MockCordovaDirectoryEntry();
			result.fullPath = directoryUrl;
			result.metadata.modificationTime = new Date();
			result.metadata.size = 0;
			this.dirMap.set(directoryUrl, result);
		}

		return result;
	}

	public async getFile(directoryEntry: CordovaDirectoryEntryLike, fileName: string, flags: CordovaFileFlags): Promise<CordovaFileEntryLike> {

		const path = directoryEntry.fullPath + '/' + fileName;
		let result = this.fileMap.get(path);

		if (!result) {
			result = new MockCordovaFileEntry();
			result.fullPath = path;
			result.metadata.modificationTime = new Date();
			result.metadata.size = 0;
			this.fileMap.set(path, result);
		}

		return result;
	}

	public async getDirectory(directoryEntry: CordovaDirectoryEntryLike, directoryName: string, flags: CordovaFileFlags): Promise<CordovaDirectoryEntryLike> {
		return this.resolveDirectoryUrl(directoryEntry.fullPath + '/' + directoryName);
	}

	private async getFileEntry(path: string, fileName: string): Promise<MockCordovaFileEntry> {
		const dir = await this.resolveDirectoryUrl(path);
		const file = await this.getFile(dir, fileName, { create: true });
		return file as MockCordovaFileEntry;
	}

	public async readAsArrayBuffer(path: string, fileName: string): Promise<ArrayBuffer> {
		const file = await this.getFileEntry(path, fileName);
		return file.data;
	}

	public async writeFile(path: string, fileName: string, text: string | Blob | ArrayBuffer, options?: CordovaFileWriteOptions): Promise<any> {
		const file = await this.getFileEntry(path, fileName);
		const data = await bufferFrom(text);
		file.data = (options && options.append && !options.replace) ? bufferConcat(file.data, data) : data;
		file.metadata.size = file.data.byteLength;
		file.metadata.modificationTime = new Date();
		return true;
	}
}