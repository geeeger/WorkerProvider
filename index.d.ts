import { EventEmitter } from "events";
import { IMyWorker, IWorkerMessage, IWorkersProvider } from "./interface";
export default class WorkerProvider extends EventEmitter implements IWorkersProvider {
    workers: IMyWorker[];
    cpus: number;
    messages: IWorkerMessage[];
    constructor(workerPath: string);
    onmessage(e: MessageEvent): void;
    run(): void;
    send(message: IWorkerMessage): void;
    destroy(): void;
}
