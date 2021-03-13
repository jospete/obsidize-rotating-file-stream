import { RotatingFileStream, MockFileSystemApi } from '../src';

describe('RotatingFileStream', () => {

	let api: MockFileSystemApi;

	beforeEach(() => {
		api = new MockFileSystemApi();
	});

	it('can be created', () => {
		const stream = new RotatingFileStream(api);
		expect(stream).toBeTruthy();
	});
});