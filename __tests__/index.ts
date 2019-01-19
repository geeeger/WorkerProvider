import WorkerProvider from "../src/index";

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
                target: this,
                data: message
            });
        }, 500);
    }

    public terminate() {
        // todo
    }
}

interface Window {
    [key: string]: any;
}

declare var window: Window;

window.Worker = Worker;

it("worker-provider should work", (done) => {
    const wp = new WorkerProvider('./fakepath');
    console.log(wp);
    wp.on('test', (data) => {
        expect(data).toBe(1);
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
        payload: 1
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
