export const dumpHex = (bytes: number[]): string => {
	return bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
};

export const dumpHexBuffer = (buffer: ArrayBuffer): string => {
	return dumpHex(Array.from(new Uint8Array(buffer)));
};

export const generateRandomBuffer = (byteLength: number): ArrayBuffer => {

	const bytes = [];

	for (let i = 0; i < byteLength; i++) {
		bytes[i] = Math.floor(Math.random() * 256);
	}

	return Uint8Array.from(bytes).buffer;
};

export const bufferFromText = async (text: string): Promise<ArrayBuffer> => {
	return new TextEncoder().encode(text).buffer;
};

export const bufferFromBlob = async (blob: Blob): Promise<ArrayBuffer> => {
	return blob.arrayBuffer();
};

export const bufferFrom = async (value: string | Blob | ArrayBuffer): Promise<ArrayBuffer> => {
	if (typeof value === 'string') return bufferFromText(value as string);
	if (value instanceof Blob) return bufferFromBlob(value as Blob);
	return value;
};

export const getBytes = (buffer: ArrayBuffer): number[] => {
	return buffer
		&& buffer instanceof ArrayBuffer
		&& buffer.byteLength > 0
		? Array.from(new Uint8Array(buffer))
		: [];
};

export const bufferConcat = (a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer => {
	const bytes = getBytes(a).concat(getBytes(b)).filter(v => typeof v === 'number');
	return Uint8Array.from(bytes).buffer;
};

export const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};