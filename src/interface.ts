import { EventEmitter } from "events";

export interface MyWorker {
    buzy: boolean;
    instance: Worker;
    [key: string]: any;
}

export interface WorkerMessage {
    channel: string;
    payload?: any;
}

export type WorkerMessages = [
    WorkerMessage,
    Transferable[]?
];

export interface WorkersProvider extends EventEmitter {
    workers: MyWorker[];
    cpus: number;
    messages: WorkerMessages[];
    onmessage(e: MessageEvent): void;
    send(message: WorkerMessage, transfer?: Transferable[]): void;
    run(): void;
    destroy(): void;
    removeMessage(message: WorkerMessage): void;
    removeMessagesByChannel(channel: string): void;
}
