import { CordovaFileEntryApi } from './cordova-file-entry-api';
import { CordovaFilePluginLike } from './cordova-file-plugin-like';
import { FileSystemApiMask } from './rotating-file-stream';

/**
 * Wrapper implementation for usage with cordova-plugin-file
 */
export class CordovaFileSystemApi implements FileSystemApiMask<CordovaFileEntryApi> {

	constructor(
		protected readonly cordovaFile: CordovaFilePluginLike
	) {
	}

	write(entry: CordovaFileEntryApi, data: ArrayBuffer): Promise<void> {
		throw new Error('Method not implemented.');
	}

	prepareEntryForWrite(entry: CordovaFileEntryApi, overwrite: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	refreshEntry(entry: CordovaFileEntryApi): Promise<CordovaFileEntryApi> {
		throw new Error('Method not implemented.');
	}
}