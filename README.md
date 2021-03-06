# @obsidize/rotating-file-stream

A cordova/ionic flavor for rotating file streams on mobile devices.

The primary goal of this module is to act as a transport outlet for [@obsidize/rx-console](https://github.com/jospete/obsidize-rx-console),
and to give an out-the-box working log-to-file solution for ionic mobile apps.

Note that while the intention of this module is for ionic app file logging, the actual implementation is
written in pure typescript with no ionic / angular / cordova dependencies embedded in it.

So theoretically this could be used as middleware for any system that has a file API and can run javascript.

If you need a pure NodeJS implementation, use [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream) instead.

## Installation

- npm:

```bash
npm install --save @obsidize/rotating-file-stream
```

- git:

```bash
npm install --save git+https://github.com/jospete/obsidize-rotating-file-stream.git
```

## Usage

1. Create A RotationFileStream instance:

```typescript
import { RotatingFileStream, CordovaFileEntryApi } from '@obsidize/rotating-file-stream';

// NOTE: While CordovaFileEntryApi is used as an example here, 
// the 'files' option can be an array of anything that implements the FileEntryLike interface.
const fileStream = new RotatingFileStream({
	maxSize: 2000000, // 2MB
	files: CordovaFileEntryApi.createCacheRotationFiles(
		cdvFile, // @ionic-native/file reference
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

Thats it!


See the [Ionic App Example](https://github.com/jospete/ionic-native-file-logging-example) for working sample code.

## API

Source documentation can be found [here](https://jospete.github.io/obsidize-rotating-file-stream/)