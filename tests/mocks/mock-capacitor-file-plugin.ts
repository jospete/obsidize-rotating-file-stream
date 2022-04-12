import { 
    CapacitorFilePluginLike, 
    RFSAppendFileOptions, 
    RFSReadFileOptions, 
    RFSReadFileResult, 
    RFSStatOptions, 
    RFSStatResult, 
    RFSWriteFileOptions, 
    RFSWriteFileResult 
} from './../../src';

class MockCapacitorFileEntry implements RFSStatResult {

    public readonly type: string = 'file';

    private mSize: number = 0;
    private mCTime: number = Date.now();
    private mMTime: number = Date.now();

    constructor(
        public uri: string,
        private mData: string = ''
    ) {
    }

    public get ctime(): number {
        return this.mCTime;
    }

    public get mtime(): number {
        return this.mMTime;
    }

    public get size(): number {
        return this.mSize;
    }

    public get data(): string {
        return this.mData;
    }

    public set data(value: string) {
        this.mData = value;
        this.mSize = (this.mData || '').length;
        this.mMTime = Date.now();
    }
}

const getFileUri = (directory: string, path: string): string => `${directory}/${path}`;

export class MockCapacitorFilePlugin implements CapacitorFilePluginLike {

    private readonly fileMap = new Map<string, MockCapacitorFileEntry>();

    public async stat({directory, path}: RFSStatOptions): Promise<RFSStatResult> {
        const result = this.fileMap.get(getFileUri(directory, path));
        return result || Promise.reject('DNE');
    }

    public async readFile({directory, path}: RFSReadFileOptions): Promise<RFSReadFileResult> {
        const {data} = this.findOrCreate(directory, path);
        return {data};
    }
    
    public async writeFile({directory, path, data}: RFSWriteFileOptions): Promise<RFSWriteFileResult> {
        const target = this.findOrCreate(directory, path);
        target.data = data;
        return {uri: target.uri};
    }

    public async appendFile({directory, path, data}: RFSAppendFileOptions): Promise<void> {
        const target = this.findOrCreate(directory, path);
        target.data += data;
    }

    private findOrCreate(directory: string, path: string): MockCapacitorFileEntry {

        const uri = getFileUri(directory, path);
        let instance = this.fileMap.get(uri);

        if (!instance) {
            instance = new MockCapacitorFileEntry(uri);
            this.fileMap.set(uri, instance);
        }

        return instance;
    }
}