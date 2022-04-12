export interface RFSStatOptions {
    path: string;
    directory?: string;
}

export interface RFSStatResult {
    type: string;
    size: number;
    ctime?: number;
    mtime: number;
    uri: string;
}

export interface RFSReadFileOptions {
    path: string;
    directory?: string;
    encoding?: string;
}

export interface RFSReadFileResult {
    data: string;
}

export interface RFSWriteFileOptions {
    path: string;
    data: string;
    directory?: string;
    encoding?: string;
    recursive?: boolean;
}

export interface RFSWriteFileResult {
    uri: string;
}

export interface RFSAppendFileOptions {
    path: string;
    data: string;
    directory?: string;
    encoding?: string;
}

/**
 * Partial interface to integrate with the 
 * [@capacitor/filesystem](https://www.npmjs.com/package/@capacitor/filesystem) 
 * module.
 */
export interface CapacitorFilePluginLike {
    stat(options: RFSStatOptions): Promise<RFSStatResult>;
    readFile(options: RFSReadFileOptions): Promise<RFSReadFileResult>;
    writeFile(options: RFSWriteFileOptions): Promise<RFSWriteFileResult>;
    appendFile(options: RFSAppendFileOptions): Promise<void>;
}