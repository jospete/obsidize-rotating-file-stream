/**
 * Used by RotatingFileStream to make write transactions 
 * and determine when to rotate files.
 */
export interface FileEntryLike {
	toURL(): string;
	getSize(): number;
	getLastModificationTime(): number;
	refresh(): Promise<void>;
	read(): Promise<ArrayBuffer>;
	write(data: ArrayBuffer, overwrite: boolean): Promise<void>;
}

/**
 * Options that dictate how a RotatingFileStream instance should function.
 */
export interface RotatingFileStreamOptions<EntryType extends FileEntryLike> {
	files: EntryType[];
	maxSize: number;
}

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
export class RotatingFileStream<EntryType extends FileEntryLike> {

	constructor(
		protected readonly options: RotatingFileStreamOptions<EntryType>
	) {
	}

	public async write(data: ArrayBuffer): Promise<void> {
		const entry = await this.loadTargetEntry();
		const shouldOverwrite = this.isEntryFull(entry);
		await entry.write(data, shouldOverwrite);
	}

	protected isEntryFull(entry: EntryType): boolean {
		return entry.getSize() >= this.options.maxSize;
	}

	protected chooseOptimalTarget(a: EntryType, b: EntryType): EntryType {

		if (a.getLastModificationTime() > b.getLastModificationTime()) {
			return this.isEntryFull(a) ? b : a;
		}

		return this.isEntryFull(b) ? a : b;
	}

	protected async loadTargetEntry(): Promise<EntryType> {

		const entries = await this.refreshAllEntries();
		let target = entries[0];

		for (let i = 1; i < entries.length; i++) {
			target = this.chooseOptimalTarget(target, entries[i]);
		}

		return target;
	}

	protected async refreshAllEntries(): Promise<EntryType[]> {

		const { files } = this.options;

		for (const file of files) {
			await file.refresh();
		}

		return files;
	}
}