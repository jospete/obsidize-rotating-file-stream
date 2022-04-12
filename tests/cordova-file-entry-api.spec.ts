import { CordovaFileEntryApi } from '../src';
import { MockCordovaFilePlugin } from './mocks/mock-cordova-file-plugin';
import { generateRandomBuffer } from './util';

describe('CordovaFileEntryApi', () => {

	it('implements the FileEntryLike interface', async () => {

		const mockCordovaFile = new MockCordovaFilePlugin();

		const files = CordovaFileEntryApi.createCacheRotationFiles(
			mockCordovaFile, 'logs', ['debug-a.log', 'debug-b.log']
		);

		const [fileA, fileB] = files;

		spyOn(fileA, 'refresh').and.callThrough();
		spyOn(fileB, 'refresh').and.callThrough();
	
		await fileA.read();
		expect(fileA.refresh).toHaveBeenCalledTimes(1);
	
		await fileA.read();
		expect(fileA.refresh).toHaveBeenCalledTimes(1);
	
		await fileB.write(generateRandomBuffer(50), true);
		expect(fileB.refresh).toHaveBeenCalledTimes(1);
	
		await fileB.write(generateRandomBuffer(50), false);
		expect(fileB.refresh).toHaveBeenCalledTimes(1);
	
		await fileB.refresh();
		expect(fileB.getSize()).toBe(100);
	});
});