import { FileSystemApiMask } from './file-system-api-mask';
import { normalizeRotatingFileStreamOptions, RotatingFileStreamOptions } from './rotating-file-stream-options';

/**
 * Core interface for publishing file data across multiple files seamlessly.
 * When a file reaches a certain size threshold, incoming data will automatically be
 * routed to the next available file in the queue.
 * 
 * When all files in the queue are full, the stream will wrap around to the oldest
 * file and overwrite it with new data.
 * 
 * The methodology of how and when the rotation mechanism happens will be 
 * fully customizable through the options given in the constructor.
 */
export class RotatingFileStream {

	private options: RotatingFileStreamOptions;

	constructor(
		protected readonly api: FileSystemApiMask,
		options: Partial<RotatingFileStreamOptions> = {}
	) {
		this.options = normalizeRotatingFileStreamOptions(options);
	}

	public async write(data: ArrayBuffer): Promise<void> {

	}
}