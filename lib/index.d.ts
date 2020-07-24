/// <reference types="node" />
import { EventEmitter } from "events";
import { MyWorker, WorkerMessage, WorkersProvider, WorkerMessages } from "./interface";
export default class WorkerProvider extends EventEmitter implements WorkersProvider {
    static isTransferablesSupported(): boolean;
    static asyncFnMover(fn: (data: WorkerMessage) => Promise<WorkerMessage>): string;
    workers: MyWorker[];
    cpus: number;
    messages: WorkerMessages[];
    constructor(workerPath: string);
    onmessage(e: MessageEvent): void;
    run(): void;
    send(message: WorkerMessage, transfer?: Transferable[]): void;
    destroy(): void;
    removeMessage(message: WorkerMessage): void;
    removeMessagesByChannel(channel: string): void;
}
