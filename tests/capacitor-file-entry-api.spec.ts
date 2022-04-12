import { CapacitorFileEntryApi } from '../src';
import { MockCapacitorFilePlugin } from './mocks/mock-capacitor-file-plugin';

describe('CapacitorFileEntryApi', () => {

	it('implements the FileEntryLike interface', async () => {

		const mockPlugin = new MockCapacitorFilePlugin();

		const files = CapacitorFileEntryApi.createCacheRotationFiles(
			mockPlugin, 'logs', ['debug-a.log', 'debug-b.log']
		);

		const [fileA, fileB] = files;

		await fileA.refresh();

		expect(fileA.getSize()).toBe(0);
		expect(fileB.getSize()).toBe(0);

		const dataText = 'Hello RFS!';
		const data = new TextEncoder().encode(dataText).buffer;
		await fileA.write(data, false);
		await fileA.refresh();

		expect(fileA.getSize()).toBe(data.byteLength);
		expect(fileB.getSize()).toBe(0);

		const fileAContentsBuffer = await fileA.read();
		const fileAContents = new TextDecoder().decode(fileAContentsBuffer);
		expect(fileAContents).toBe(dataText);

		expect(fileA.toURL()).toBeTruthy();
		expect(fileB.toURL()).toBeFalsy();

		expect(Math.abs(Date.now() - fileA.getLastModificationTime()) < 10).toBe(true);
		expect(fileB.getLastModificationTime()).toBe(0);

		await fileA.write(data, true);
		await fileA.refresh();
		await fileB.write(data, true);
		await fileB.refresh();

		expect(fileA.toURL()).toBeTruthy();
		expect(fileB.toURL()).toBeTruthy();
		expect(fileB.getLastModificationTime()).not.toBe(0);

		expect(await fileA.read()).toEqual(data);
		expect(await fileB.read()).toEqual(data);
	});
});