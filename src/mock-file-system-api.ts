import { FileEntryLike, FileSystemApiMask } from './file-system-api-mask';

/**
 * Utility for testing this module in isolation.
 */
export class MockFileSystemApi implements FileSystemApiMask {

	refreshEntry(entry: FileEntryLike): Promise<FileEntryLike> {
		throw new Error('Method not implemented.');
	}

	write(entry: FileEntryLike, data: ArrayBuffer): Promise<void> {
		throw new Error('Method not implemented.');
	}
}