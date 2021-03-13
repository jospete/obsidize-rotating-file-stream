import { FileSystemApiMask } from './file-system-api-mask';

export class MockFileSystemApi implements FileSystemApiMask {

	write(data: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}