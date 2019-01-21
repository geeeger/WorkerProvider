import { EventEmitter } from "events";
import { IMyWorker, IWorkerMessage, IWorkersProvider } from "./interface";

export default class WorkerProvider extends EventEmitter implements IWorkersProvider {
    public workers: IMyWorker[];
    public cpus: number;
    public messages: any[];
    constructor(workerPath: string) {
        super();
        this.workers = [];
        this.messages = [];
        this.cpus = window.navigator.hardwareConcurrency || 1;
        for (let i = 0; i < this.cpus; i++) {
            const worker: IMyWorker = {
                buzy: false,
                instance: new Worker(workerPath),
            };
            this.workers.push(worker);
        }

        for (let i = 0; i < this.cpus; i++) {
            this.workers[i].instance.onmessage = this.onmessage.bind(this);
        }
    }

    public onmessage(e: any) {
        for (let i = 0; i < this.cpus; i++) {
            const worker = this.workers[i];
            if (e.target === worker.instance) {
                worker.buzy = false;
                this.run();
            }
        }
        const { channel, payload } = e.data;
        this.emit(channel, payload);
    }

    public run() {
        const idles = this.workers.filter((worker: IMyWorker) => !worker.buzy);
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const idleWorker = idles.pop();
            if (!idleWorker) {
                break;
            }
            const message = this.messages.pop();
            idleWorker.buzy = true;
            idleWorker.instance.postMessage.apply(idleWorker.instance, message);
        }
    }

    public send(message: IWorkerMessage, transfer?: Transferable[]) {
        this.messages.push([message, transfer]);
        this.run();
    }

    public destroy() {
        this.workers.forEach((worker: IMyWorker) => {
            worker.instance.terminate();
        });
        this.workers = null;
        this.messages = null;
        this.removeAllListeners();
    }
}
