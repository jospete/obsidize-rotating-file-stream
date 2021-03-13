/**
 * Options that dictate how a RotatingFileStream instance should function.
 */
export interface RotatingFileStreamOptions {
	files: FileEntryLike[];
	maxSize: number;
}

/**
 * Used by RotatingFileStream to make write transactions 
 * and determine when to rotate files.
 */
export interface FileEntryLike {
	toURL(): string;
	getSize(): number;
	getLastModificationTime(): number;
}

/**
 * Core file system API layout that is required for 
 * this module to function effectively. 
 */
export interface FileSystemApiMask {
	write(entry: FileEntryLike, data: ArrayBuffer): Promise<void>;
	prepareEntryForWrite(entry: FileEntryLike, overwrite: boolean): Promise<void>;
	refreshEntry(entry: FileEntryLike): Promise<FileEntryLike>;
}

/**
 * Utility to ensure that sensible defaults are provided for missing options.
 */
export const normalizeRotatingFileStreamOptions = (
	explicitOptions: Partial<RotatingFileStreamOptions>
): RotatingFileStreamOptions => {
	return { files: [], maxSize: 500000 };
};

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
		const entry = await this.loadTargetEntry();
		await this.api.prepareEntryForWrite(entry, this.isEntryFull(entry));
		await this.api.write(entry, data);
	}

	protected isEntryFull(entry: FileEntryLike): boolean {
		return entry.getSize() >= this.options.maxSize;
	}

	protected chooseOptimalTarget(a: FileEntryLike, b: FileEntryLike): FileEntryLike {

		if (a.getLastModificationTime() > b.getLastModificationTime()) {
			return this.isEntryFull(a) ? b : a;
		}

		return this.isEntryFull(b) ? a : b;
	}

	// TODO: we probably want to add a caching optimization to 
	// avoid having reload calls milliseconds apart from each other
	protected async refreshEntry(entry: FileEntryLike): Promise<FileEntryLike> {
		return this.api.refreshEntry(entry);
	}

	protected async loadTargetEntry(): Promise<FileEntryLike> {

		const entries = await this.refreshAllEntries();
		let target = entries[0];

		for (let i = 1; i < entries.length; i++) {
			target = this.chooseOptimalTarget(target, entries[i]);
		}

		return target;
	}

	protected async refreshAllEntries(): Promise<FileEntryLike[]> {

		const { files } = this.options;

		for (let i = 0; i < files.length; i++) {
			files[i] = await this.refreshEntry(files[i]);
		}

		this.options.files = files;
		return files;
	}
}