import { CordovaFilePluginLike } from './cordova-file-plugin-like';
import { FileEntryLike } from './rotating-file-stream';

/**
 * Represents a single file entry from the cordova file plugin system.
 */
export class CordovaFileEntryApi implements FileEntryLike {

	constructor(
		private readonly cordovaFile: CordovaFilePluginLike
	) {
	}

	toURL(): string {
		throw new Error('Method not implemented.');
	}

	getSize(): number {
		throw new Error('Method not implemented.');
	}

	getLastModificationTime(): number {
		throw new Error('Method not implemented.');
	}
}