import { RotatingFileStream } from '../src';

describe('RotatingFileStream', () => {

	it('can be created', () => {
		const stream = new RotatingFileStream({ files: [], maxSize: 500000 });
		expect(stream).toBeTruthy();
	});
});