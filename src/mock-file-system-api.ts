import { FileEntryLike, FileSystemApiMask } from './rotating-file-stream';

/**
 * Utility for testing this module in isolation.
 */
export class MockFileSystemApi implements FileSystemApiMask<FileEntryLike> {

	prepareEntryForWrite(entry: FileEntryLike, overwrite: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	refreshEntry(entry: FileEntryLike): Promise<FileEntryLike> {
		throw new Error('Method not implemented.');
	}

	write(entry: FileEntryLike, data: ArrayBuffer): Promise<void> {
		throw new Error('Method not implemented.');
	}
}