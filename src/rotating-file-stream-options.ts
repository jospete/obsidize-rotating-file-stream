import { FileEntryLike } from './file-system-api-mask';

/**
 * Options that dictate how a RotatingFileStream instance should function.
 */
export interface RotatingFileStreamOptions {
	files: FileEntryLike[];
	maxSize: number;
}

/**
 * Utility to ensure that sensible defaults are provided for missing options.
 */
export const normalizeRotatingFileStreamOptions = (
	explicitOptions: Partial<RotatingFileStreamOptions>
): RotatingFileStreamOptions => {
	return { files: [], maxSize: 500000 };
};