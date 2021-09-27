import { CordovaFileEntryApi, RotatingFileStream } from '../src';

import { MockCordovaFilePlugin } from './mock-cordova-file-plugin';
import { dumpHexBuffer, generateRandomBuffer, sleep } from './util';

describe('RotatingFileStream', () => {

	it('can be created', () => {
		const stream = new RotatingFileStream({ files: [], maxFileSize: 500000 });
		expect(stream).toBeTruthy();
	});

	it('rotates between a given set of file entries when data is streamed to it', async () => {

		const maxFileSize = 500;
		const mockCordovaFile = new MockCordovaFilePlugin();

		const files = CordovaFileEntryApi.createCacheRotationFiles(
			mockCordovaFile, 'logs', ['debug-a.log', 'debug-b.log']
		);

		const [fileA, fileB] = files;

		const rfs = new RotatingFileStream({
			files, maxFileSize
		});

		const mockData1 = generateRandomBuffer(502);
		await rfs.write(mockData1);

		expect(fileA.toURL()).toBe('cache/logs/debug-a.log');
		expect(fileB.toURL()).toBe('cache/logs/debug-b.log');

		const readResult = await fileA.read();
		console.log('mockData1  = ' + dumpHexBuffer(mockData1));
		console.log('readResult = ' + dumpHexBuffer(readResult));

		expect(readResult).toEqual(mockData1);

		// Data of atomic write calls should not be broken apart.
		expect(fileA.getSize()).toBe(502);
		expect(fileB.getSize()).toBe(0);

		const mockData2 = generateRandomBuffer(42);
		await rfs.write(mockData2);

		// Rotation should occur when the previous target becomes full (size >= 500 as dictated by our options object)
		expect(fileA.getSize()).toBe(502);
		expect(fileB.getSize()).toBe(42);
	});

	it('rotates back to the oldest file when all files are full', async () => {

		const maxFileSize = 500;
		const mockCordovaFile = new MockCordovaFilePlugin();

		const files = CordovaFileEntryApi.createCacheRotationFiles(
			mockCordovaFile, 'logs', ['debug-a.log', 'debug-b.log']
		);

		const [fileA, fileB] = files;

		// Defaults on initialization before data is refreshed
		expect(fileA.toURL()).toBe('');
		expect(fileA.getLastModificationTime()).toBe(0);
		expect(fileA.getSize()).toBe(0);

		const rfs = new RotatingFileStream({
			files, maxFileSize
		});

		const mockData = generateRandomBuffer(250);

		for (let i = 0; i < 5; i++) {
			await rfs.write(mockData);
			await sleep(50);
		}

		expect(fileA.getSize()).toBe(250);
		expect(fileB.getSize()).toBe(500);

		await rfs.write(mockData);
		await sleep(50);
		await fileA.write(mockData, false);
		await sleep(50);

		expect(fileA.getSize()).toBe(750);
		expect(fileB.getSize()).toBe(500);

		await rfs.write(mockData);

		// B will be chosen because A was more recently edited and both are full
		expect(fileA.getSize()).toBe(750);
		expect(fileB.getSize()).toBe(250);
	});
});