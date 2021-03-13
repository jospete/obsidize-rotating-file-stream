/**
 * Options that dictate how a RotatingFileStream instance should function.
 */
export interface RotatingFileStreamOptions {

}

/**
 * Utility to ensure that sensible defaults are provided for missing options.
 */
export const normalizeRotatingFileStreamOptions = (
	explicitOptions: Partial<RotatingFileStreamOptions>
): RotatingFileStreamOptions => {
	return {};
};