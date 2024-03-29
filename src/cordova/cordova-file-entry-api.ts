import { FileEntryLike } from '../core/rotating-file-stream';

import {
	RFSCordovaDirectoryEntryLike,
	RFSCordovaFileEntryLike,
	RFSCordovaFileEntryMetadataLike,
	CordovaFilePluginLike
} from './cordova-file-plugin-like';

/**
 * Represents a single file entry from the cordova file plugin system.
 */
export class CordovaFileEntryApi implements FileEntryLike {

	protected targetBaseDirectory: RFSCordovaDirectoryEntryLike | null = null;
	protected targetDirectory: RFSCordovaDirectoryEntryLike | null = null;
	protected targetFile: RFSCordovaFileEntryLike | null = null;
	protected targetFileMetadata: RFSCordovaFileEntryMetadataLike | null = null;

	constructor(
		protected readonly cordovaFile: CordovaFilePluginLike,
		protected readonly baseCordovaDirectoryNameDelegate: () => string,
		protected readonly directoryName: string,
		protected readonly fileName: string
	) {
	}

	public static createCacheRotationFiles(
		cordovaFile: CordovaFilePluginLike,
		directory: string,
		filenames: string[]
	): CordovaFileEntryApi[] {
		return CordovaFileEntryApi.createRotationFiles(
			cordovaFile,
			() => cordovaFile.cacheDirectory,
			directory,
			filenames
		);
	}

	public static createRotationFiles(
		cordovaFile: CordovaFilePluginLike,
		baseDirectoryDelegate: () => string,
		directory: string,
		filenames: string[]
	): CordovaFileEntryApi[] {
		return filenames.map(filename => new CordovaFileEntryApi(
			cordovaFile,
			baseDirectoryDelegate,
			directory,
			filename
		));
	}

	public get baseCordovaDirectoryName(): string {
		return this.baseCordovaDirectoryNameDelegate();
	}

	public getFileName(): string {
		return this.fileName;
	}

	public getDirectoryName(): string {
		return this.directoryName;
	}

	public toURL(): string {
		return this.targetFile ? this.targetFile.toURL() : '';
	}

	public getSize(): number {
		return this.targetFileMetadata ? this.targetFileMetadata.size : 0;
	}

	public getLastModificationTime(): number {
		return this.targetFileMetadata ? new Date(this.targetFileMetadata.modificationTime).getTime() : 0;
	}

	public async write(data: ArrayBuffer, overwrite: boolean): Promise<void> {
		if (!this.targetDirectory) await this.refresh();
		await this.cordovaFile.writeFile(this.targetDirectory!.toURL(), this.fileName, data, { append: !overwrite, replace: overwrite });
	}

	public async read(): Promise<ArrayBuffer> {
		if (!this.targetDirectory) await this.refresh();
		return this.cordovaFile.readAsArrayBuffer(this.targetDirectory!.toURL(), this.fileName);
	}

	public async refresh(): Promise<void> {
		this.targetBaseDirectory = await this.cordovaFile.resolveDirectoryUrl(this.baseCordovaDirectoryName);
		this.targetDirectory = await this.cordovaFile.getDirectory(this.targetBaseDirectory, this.directoryName, { create: true });
		this.targetFile = await this.cordovaFile.getFile(this.targetDirectory, this.fileName, { create: true });
		this.targetFileMetadata = await (new Promise((resolve, reject) => this.targetFile!.getMetadata(resolve, reject)));
	}
}