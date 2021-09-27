/**
 * Used by RotatingFileStream to make write transactions 
 * and determine when to rotate files.
 */
export interface FileEntryLike {

	/**
	 * Absolute path to the entry, typically a native file system URI.
	 */
	toURL(): string;

	/**
	 * The current size in bytes of this entry.
	 * Used to determine if the stream needs to rotate to a new entry.
	 */
	getSize(): number;

	/**
	 * The last time this entry was edited.
	 * This is used to determine which files are the oldest when
	 * a rotation happens and all files are full.
	 */
	getLastModificationTime(): number;

	/**
	 * Called when the entry should refresh its metadata,
	 * including size and last modification time.
	 */
	refresh(): Promise<void>;

	/**
	 * Option to read the entire entry contents from disk.
	 * Not actively used in the process, but a nice-to-have when
	 * interfacing with entries.
	 */
	read(): Promise<ArrayBuffer>;

	/**
	 * Called when the entry is being overwritten or appened to.
	 * @param data - the buffer to write to disk
	 * @param overwrite - if this write should erase existing data
	 */
	write(data: ArrayBuffer, overwrite: boolean): Promise<void>;
}

/**
 * Options that dictate how a RotatingFileStream instance should function.
 */
export interface RotatingFileStreamOptions<EntryType extends FileEntryLike> {
	files: EntryType[];
	maxFileSize: number;
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
		return entry.getSize() >= this.options.maxFileSize;
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