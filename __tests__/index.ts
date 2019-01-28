import WorkerProvider from "../src/index";
import { IWorkerMessage } from "../src/interface";

class Worker {
    public path: string;
    constructor(path) {
        this.path = path;
    }

    public onmessage(e) {
        // rewrite
    }

    public postMessage(message) {
        setTimeout(() => {
            this.onmessage({
                data: message,
                target: this,
            });
        }, 500);
    }

    public terminate() {
        // todo
    }
}

interface IWindow {
    [key: string]: any;
}

declare var window: IWindow;

window.Worker = Worker;

it("worker-provider should work", (done) => {
    const wp = new WorkerProvider('./fakepath');
    wp.on('test', (error, data) => {
        if (!error) {
            expect(data).toBe(1);
        }
    });

    wp.send({
        channel: 'test',
        payload: 1
    });
    wp.send({
        channel: 'test',
        payload: 1
    });
    wp.send({
        channel: 'test',
        payload: 1
    });
    wp.send({
        channel: 'test',
        payload: 1
    });
    wp.send({
        channel: 'test',
        payload: 1,
    });

    setTimeout(() => {
        wp.destroy();
        expect(wp.workers).toBeNull();
        done();
    }, 1000);
});

it("if hardwareConcurrency is undefined", (done) => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
        get() {
            return undefined;
        }
    });
    const wp = new WorkerProvider('./fakepath');
    expect(wp.cpus).toBe(1);
    done();
});

// JSDOM does not implement URL.createObjectURL

Object.defineProperty(window.URL, 'createObjectURL', {
    value: () => {
        return 'fake';
    },
});

it('static isTransferablesSupported()', () => {
    // because Worker is mocked
    expect(WorkerProvider.isTransferablesSupported()).toBeFalsy();
});

it('static asyncFnMover()', () => {
    expect(typeof WorkerProvider.asyncFnMover(function calc(data: IWorkerMessage) {
        let payload = data.payload;
        const channel = data.channel;
        payload++;
        return Promise.resolve({
            channel,
            payload,
        });
    })).toBe('string');
});
