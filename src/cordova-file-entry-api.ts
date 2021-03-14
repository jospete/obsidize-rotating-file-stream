import { CordovaDirectoryEntryLike, CordovaFileEntryLike, CordovaFileEntryMetadataLike, CordovaFilePluginLike } from './cordova-file-plugin-like';
import { FileEntryLike } from './rotating-file-stream';

export type Nullable<T> = T | null;

/**
 * Represents a single file entry from the cordova file plugin system.
 */
export class CordovaFileEntryApi implements FileEntryLike {

	protected targetBaseDirectory: Nullable<CordovaDirectoryEntryLike> = null;
	protected targetDirectory: Nullable<CordovaDirectoryEntryLike> = null;
	protected targetFile: Nullable<CordovaFileEntryLike> = null;
	protected targetFileMetadata: Nullable<CordovaFileEntryMetadataLike> = null;

	constructor(
		protected readonly cordovaFile: CordovaFilePluginLike,
		protected readonly baseCordovaDirectory: string,
		protected readonly directory: string,
		protected readonly filename: string
	) {
	}

	public static createCacheRotationFiles(
		cordovaFile: CordovaFilePluginLike,
		directory: string,
		filenames: string[]
	): CordovaFileEntryApi[] {
		return CordovaFileEntryApi.createRotationFiles(
			cordovaFile,
			cordovaFile.cacheDirectory,
			directory,
			filenames
		);
	}

	public static createRotationFiles(
		cordovaFile: CordovaFilePluginLike,
		baseDirectory: string,
		directory: string,
		filenames: string[]
	): CordovaFileEntryApi[] {
		return filenames.map(filename => new CordovaFileEntryApi(
			cordovaFile,
			baseDirectory,
			directory,
			filename
		));
	}

	public toURL(): string {
		return this.targetFile?.toURL() ?? '';
	}

	public getSize(): number {
		return this.targetFileMetadata?.size ?? 0;
	}

	public getLastModificationTime(): number {
		return new Date(this.targetFileMetadata?.modificationTime ?? 0).getTime();
	}

	public async write(data: ArrayBuffer, overwrite: boolean): Promise<void> {
		await this.cordovaFile.writeFile(this.directory, this.filename, data, { append: !overwrite, replace: overwrite });
	}

	public async read(): Promise<ArrayBuffer> {
		return this.cordovaFile.readAsArrayBuffer(this.targetDirectory?.toURL() ?? '', this.filename);
	}

	public async refresh(): Promise<void> {
		this.targetBaseDirectory = await this.cordovaFile.resolveDirectoryUrl(this.baseCordovaDirectory);
		this.targetDirectory = await this.cordovaFile.getDirectory(this.targetBaseDirectory, this.directory, { create: true });
		this.targetFile = await this.cordovaFile.getFile(this.targetDirectory, this.filename, { create: true });
		this.targetFileMetadata = await (new Promise((resolve, reject) => this.targetFile?.getMetadata(resolve, reject)));
	}
}