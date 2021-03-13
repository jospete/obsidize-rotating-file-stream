import { FileSystemApiMask } from './file-system-api-mask';
import { normalizeRotatingFileStreamOptions, RotatingFileStreamOptions } from './rotating-file-stream-options';

/**
 * 
 */
export class RotatingFileStream {

	private options: RotatingFileStreamOptions;

	constructor(
		protected readonly api: FileSystemApiMask,
		options: Partial<RotatingFileStreamOptions> = {}
	) {
		this.options = normalizeRotatingFileStreamOptions(options);
	}
}