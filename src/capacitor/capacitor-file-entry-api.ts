import { CapacitorFilePluginLike } from './capacitor-file-plugin-like';
import { FileEntryLike } from '../core/rotating-file-stream';

const CACHE_DIRECTORY = 'CACHE';
const ASCII_ENCODING = 'ascii';

/**
 * Represents a single file entry from the capacitor file plugin system.
 */
export class CapacitorFileEntryApi implements FileEntryLike {

	private mModifiedTime: number = 0;
	private mSize: number = 0;
	private mUri: string | null = null;

	constructor(
		protected readonly capacitorFilesystem: CapacitorFilePluginLike,
		protected readonly directory: string,
		protected readonly filePath: string
	) {
	}

	public static createCacheRotationFiles(
		capacitorFilesystem: CapacitorFilePluginLike,
		rotationFilesDirectory: string,
		filenames: string[]
	): CapacitorFileEntryApi[] {
		return CapacitorFileEntryApi.createRotationFiles(
			capacitorFilesystem,
			CACHE_DIRECTORY,
			rotationFilesDirectory,
			filenames
		);
	}

	public static createRotationFiles(
		capacitorFilesystem: CapacitorFilePluginLike,
		rootDirectory: string,
		rotationFilesDirectory: string,
		filenames: string[]
	): CapacitorFileEntryApi[] {
		return filenames.map(fileName => new CapacitorFileEntryApi(
			capacitorFilesystem,
			rootDirectory,
			`${rotationFilesDirectory}/${fileName}`
		));
	}

	public toURL(): string {
		return this.mUri!;
	}

	public getSize(): number {
		return this.mSize;
	}

	public getLastModificationTime(): number {
		return this.mModifiedTime;
	}

	public async read(): Promise<ArrayBuffer> {

		const {data} = await this.capacitorFilesystem.readFile({
			directory: this.directory,
			path: this.filePath,
			encoding: ASCII_ENCODING
		});

		return new TextEncoder().encode(data).buffer;
	}

	public async refresh(): Promise<void> {

		const {mtime, size, uri} = await this.capacitorFilesystem.stat({
			directory: this.directory,
			path: this.filePath
		}).catch(() => ({
			mtime: 0,
			size: 0,
			uri: ''
		}));

		this.mModifiedTime = mtime;
		this.mSize = size;
		this.mUri = uri;
	}

	public async write(bufferData: ArrayBuffer, overwrite: boolean): Promise<void> {

		const data = new TextDecoder().decode(bufferData);

		if (overwrite && this.mSize > 0) {

			await this.capacitorFilesystem.appendFile({
				directory: this.directory,
				path: this.filePath,
				encoding: ASCII_ENCODING,
				data
			});

		} else {

			const {uri} = await this.capacitorFilesystem.writeFile({
				directory: this.directory,
				path: this.filePath,
				encoding: ASCII_ENCODING,
				recursive: true,
				data
			});

			this.mUri = uri;
		}
	}
}