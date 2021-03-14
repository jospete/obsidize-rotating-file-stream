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

	public isEntryFull(entry: EntryType): boolean {
		return entry.getSize() >= this.options.maxSize;
	}

	public async write(data: ArrayBuffer): Promise<void> {
		const entry = await this.loadTargetEntry();
		const shouldOverwrite = this.isEntryFull(entry);
		await entry.write(data, shouldOverwrite);
	}

	public async refreshAllEntries(): Promise<EntryType[]> {

		const { files } = this.options;

		for (const file of files) {
			await file.refresh();
		}

		return files;
	}

	protected async loadTargetEntry(): Promise<EntryType> {

		const entries = await this.refreshAllEntries();
		let target = entries[0];

		for (let i = 1; i < entries.length; i++) {
			target = this.chooseOptimalTarget(target, entries[i]);
		}

		return target;
	}

	protected chooseOptimalTarget(a: EntryType, b: EntryType): EntryType {

		// A still has room to append data
		if (!this.isEntryFull(a)) {
			return a;
		}

		// A is full, but B still has room to append data
		if (!this.isEntryFull(b)) {
			return b;
		}

		// Overwrite B when both are full and A was more recently modified (B is older and should be overwritten in rotation)
		if (a.getLastModificationTime() > b.getLastModificationTime()) {
			return b;
		}

		// Both are full and somehow equally old... so default to using A
		return a;
	}
}