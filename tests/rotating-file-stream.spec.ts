import { CordovaFileEntryApi, RotatingFileStream } from '../src';
import { MockCordovaFilePlugin } from './mock-cordova-file-plugin';

const generateRandomBuffer = (byteLength: number): ArrayBuffer => {

	const result = new ArrayBuffer(byteLength);

	for (let i = 0; i < byteLength; i++) {
		result[i] = Math.floor(Math.random() * 256);
	}

	return result;
};

describe('RotatingFileStream', () => {

	it('can be created', () => {
		const stream = new RotatingFileStream({ files: [], maxSize: 500000 });
		expect(stream).toBeTruthy();
	});

	it('rotates between a given set of file entries when data is streamed to it', async () => {

		const maxSize = 500;
		const mockCordovaFile = new MockCordovaFilePlugin();

		const files = CordovaFileEntryApi.createCacheRotationFiles(
			mockCordovaFile, 'logs', ['debug-a.log', 'debug-b.log']
		);

		const [fileA, fileB] = files;

		const rfs = new RotatingFileStream({
			files, maxSize
		});

		const mockData1 = generateRandomBuffer(502);
		await rfs.write(mockData1);

		expect(fileA.toURL()).toBe('cache/logs/debug-a.log');
		expect(fileB.toURL()).toBe('cache/logs/debug-b.log');

		const readResult = await fileA.read();
		expect(readResult).toEqual(mockData1);

		// Internal refresh happens before write, so we need to 
		// refresh again to do proper metadata comparisons.
		await rfs.refreshAllEntries();

		// Data of atomic write calls should not be broken apart.
		expect(fileA.getSize()).toBe(502);
		expect(fileB.getSize()).toBe(0);

		const mockData2 = generateRandomBuffer(42);
		await rfs.write(mockData2);

		// Rotation should occur when the previous target becomes full (size >= 500 as dictated by our options object)
		expect(fileA.getSize()).toBe(502);
		expect(fileB.getSize()).toBe(42);
	});
});