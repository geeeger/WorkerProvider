import { EventEmitter } from "events";
export interface IMyWorker {
    buzy: boolean;
    instance: Worker;
    [key: string]: any;
}
export interface IWorkerMessage {
    channel: number;
    payload?: any;
}
export interface IWorkersProvider extends EventEmitter {
    workers: IMyWorker[];
    cpus: number;
    messages: IWorkerMessage[];
    onmessage(e: MessageEvent): void;
    send(message: IWorkerMessage): void;
    run(): void;
    destroy(): void;
}
