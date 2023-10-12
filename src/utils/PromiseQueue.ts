import { Queue } from 'queue-typescript';

export type PromiseFunction<T, R> = (item: T) => Promise<R>;

interface PromiseItem<T, R> {
    item: T;
    promiseFunction: PromiseFunction<T, R>;
    resolve?: (result: R) => void;
    reject?: (reason?: any) => void;
    hasCanceled: boolean;
}

export interface CancelableItem {
    cancel(): void;
}

export class CancelablePromiseItem<T, R> implements PromiseItem<T, R>, CancelableItem {

    public item: T;
    public promiseFunction: PromiseFunction<T, R>;
    public resolve?: (result: R) => void;
    public reject?: (reason?: any) => void;
    public hasCanceled: boolean;

    public constructor(item: T, promiseFunction: PromiseFunction<T, R>, resolve?: (result: R) => void) {
        this.item = item;
        this.promiseFunction = promiseFunction;
        this.resolve = resolve;
        this.hasCanceled = false;
    }

    public cancel(): void {
        this.hasCanceled = true;
    }

}

export default class PromiseQueue<T, R> {

    private queue: Queue<PromiseItem<T, R>>;
    private workingOnPromise: boolean;

    constructor() {
        this.queue = new Queue<PromiseItem<T, R>>();
        this.workingOnPromise = false;
    }

    async enqueueAsync(item: T, promiseFunction: PromiseFunction<T, R>): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            this.queue.enqueue({ item, promiseFunction, resolve, reject, hasCanceled: false });
            this.dequeue();
        });
    }

    enqueue(item: T, promiseFunction: PromiseFunction<T, R>, callback?: (result: R) => void): CancelableItem {
        const promiseItem = new CancelablePromiseItem(item, promiseFunction, callback);
        this.queue.enqueue(promiseItem);
        this.dequeue();
        return promiseItem;
    }

    dequeue(): boolean {
        if (this.workingOnPromise) {
            return false;
        }
        const promiseItem = this.queue.dequeue();
        if (!promiseItem) {
            return false;
        }
        const { item, promiseFunction, resolve, reject, hasCanceled } = promiseItem;
        try {
            if (hasCanceled) {
                return this.dequeue();
            }
            this.workingOnPromise = true;
            promiseFunction(item)
                .then((result) => {
                    this.workingOnPromise = false;
                    if (hasCanceled === false) {
                        resolve?.call(this, result);
                    }
                    this.dequeue();
                })
                .catch(err => {
                    this.workingOnPromise = false;
                    if (hasCanceled === false) {
                        reject?.call(this, err);
                    }
                    this.dequeue();
                })
        } catch (err) {
            this.workingOnPromise = false;
            reject?.call(this, err);
            this.dequeue();
        }
        return true;
    }
}