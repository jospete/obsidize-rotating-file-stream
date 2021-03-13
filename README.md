# @obsidize/rotating-file-stream

A cordova/ionic flavor for rotating file streams on mobile devices.

The primary goal of this module is to act as a transport outlet for [@obsidize/rx-console](https://github.com/jospete/obsidize-rx-console),
and to give an out-the-box working log-to-file solution for ionic mobile apps.

Note that while the intention of this module is for ionic app file logging, the actual implementation is
written in pure typescript with no ionic / angular / cordova dependencies embedded in it.

So theoretically this could be used as middleware for any system that has a file API and can run javascript.