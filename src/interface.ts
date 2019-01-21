import { EventEmitter } from "events";

export interface IMyWorker {
    buzy: boolean;
    instance: Worker;
    [key: string]: any;
}

export interface IWorkerMessage {
    channel: string;
    payload?: any;
}

export interface IWorkersProvider extends EventEmitter {
    workers: IMyWorker[];
    cpus: number;
    messages: IWorkerMessage[];
    onmessage(e: any): void;
    send(message: IWorkerMessage, transfer?: Transferable[]): void;
    run(): void;
    destroy(): void;
}
