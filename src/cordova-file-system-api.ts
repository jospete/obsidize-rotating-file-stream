import { FileEntryLike, FileSystemApiMask } from './rotating-file-stream';

export interface CordovaFilePluginLike {

}

/**
 * Wrapper implementation for usage with cordova-plugin-file
 */
export class CordovaFileSystemApi implements FileSystemApiMask {

	constructor(
		protected readonly cordovaFile: CordovaFilePluginLike
	) {
	}

	write(entry: FileEntryLike, data: ArrayBuffer): Promise<void> {
		throw new Error('Method not implemented.');
	}
	prepareEntryForWrite(entry: FileEntryLike, overwrite: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}
	refreshEntry(entry: FileEntryLike): Promise<FileEntryLike> {
		throw new Error('Method not implemented.');
	}
}