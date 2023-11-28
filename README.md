# @obsidize/rotating-file-stream

Simple wrapper for streaming data to files on mobile devices in hybrid apps.

If you're using this for log capture on a cordova / capacitor app,
consider using [cordova-plugin-secure-logger](https://github.com/jospete/cordova-plugin-secure-logger) instead.

If you need a pure NodeJS implementation, use [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream) instead.

## Installation

- npm:

```bash
npm install --save @obsidize/rotating-file-stream
```

## API

Source documentation can be found [here](https://jospete.github.io/obsidize-rotating-file-stream/)

## Usage

1. Create A RotationFileStream instance:

```typescript
import { RotatingFileStream, CordovaFileEntryApi, CapacitorFileEntryApi } from '@obsidize/rotating-file-stream';

const fileStream = new RotatingFileStream({
	maxFileSize: 2e6, // 2MB
	files: CordovaFileEntryApi.createCacheRotationFiles(
		cdvFile, // @awesome-cordova-plugins/file reference
		'logs',
		['debug-a.log', 'debug-b.log']
	)
});

// Or if you want to use @capacitor/filesystem
const fileStream = new RotatingFileStream({
	maxFileSize: 2e6, // 2MB
	files: CapacitorFileEntryApi.createCacheRotationFiles(
		Filesystem, // @capacitor/filesystem reference
		'logs',
		['debug-a.log', 'debug-b.log']
	)
});
```

2. Write to the stream:

```typescript
const buffer = new ArrayBuffer(42);
fileStream.write(buffer).then(...);
```

3. Read data back later on:

```typescript
const entries = await fileStream.refreshAllEntries();

for (const entry of entries) {
	// read the entry data, or get its URL and do something with it
}
```