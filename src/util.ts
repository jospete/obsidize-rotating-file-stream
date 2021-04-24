export type Nullable<T> = T | null;
export type NodeCallback<T> = (error: Nullable<any>, value: T) => void;

export const promisifyNodeCallback = <T>(action: (callback: NodeCallback<T>) => void): Promise<T> => {
	return new Promise<T>((resolve, reject) => action((error, result) => error ? reject(error) : resolve(result)));
};