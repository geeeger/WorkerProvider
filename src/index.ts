import { EventEmitter } from "events";
import { IMyWorker, IWorkerMessage, IWorkersProvider } from "./interface";

export default class WorkerProvider extends EventEmitter implements IWorkersProvider {
    public static isTransferablesSupported() {
        return (() => {
            // See
            // https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast
            const buffer = new ArrayBuffer(1);
            try {
                const blob = new Blob([""], {
                    type: "text/javascript",
                });
                const urlObj = URL.createObjectURL(blob);

                const worker = new Worker(urlObj);
                worker.postMessage(buffer, [
                    buffer,
                ]);
                worker.terminate();
            } catch (e) {
                // nothing to do
            }
            return !Boolean(buffer.byteLength);
        })();
    }
    public static asyncFnMover(fn: (data: IWorkerMessage) => Promise<IWorkerMessage>): string {
        const blob = new Blob([`
            $$=${fn};
            onmessage=function (e) {
                Promise.resolve(function() {
                        return $$.apply($$, e.data);
                    })
                    .then(
                        function (res) {
                            postMessage(res);
                        },
                        function (err) {
                            postMessage({
                                channel: e.data.channel,
                                error: err
                            });
                        }
                    )
            };
        `], {
            type: "text/javascript",
        });
        return URL.createObjectURL(blob);
    }
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
        const { channel, payload, error } = e.data;
        this.emit(channel, error, payload);
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

    public removeMessage(message: IWorkerMessage) {
        if (this.messages) {
            for (let index = 0; index < this.messages.length; index++) {
                const element = this.messages[index][0];
                if (element === message) {
                    this.messages.splice(index, 1);
                    break;
                }
            }
        }
    }

    public removeMessagesByChannel(channel) {
        if (this.messages) {
            let index = 0;
            let element = this.messages[index];
            while (element) {
                const message = element[0];
                if (message.channel === channel) {
                    this.messages.splice(index, 1);
                } else {
                    index++;
                }
                element = this.messages[index];
            }
        }
    }
}
