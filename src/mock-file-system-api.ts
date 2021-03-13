import { FileSystemApiMask } from './file-system-api-mask';

/**
 * Utility for testing this module in isolation.
 */
export class MockFileSystemApi implements FileSystemApiMask {

	write(data: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}