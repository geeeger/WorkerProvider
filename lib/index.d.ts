/// <reference types="node" />
import { EventEmitter } from "events";
import { IMyWorker, IWorkerMessage, IWorkersProvider } from "./interface";
export default class WorkerProvider extends EventEmitter implements IWorkersProvider {
    static isTransferablesSupported(): boolean;
    workers: IMyWorker[];
    cpus: number;
    messages: any[];
    constructor(workerPath: string);
    onmessage(e: any): void;
    run(): void;
    send(message: IWorkerMessage, transfer?: Transferable[]): void;
    destroy(): void;
}
