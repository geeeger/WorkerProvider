import WorkerProvider from '../src/index';
class Worker {
    path: string;
    constructor(path) {
        this.path = path;
    }

    onmessage(fn) {
    }

    postMessage(message) {
        this.onmessage(new MessageEvent('message', {
            data: message
        }));
    }
}


it('should exist', () => {
    const wp = new WorkerProvider('./worker');
    expect(wp).toBeDefined();
})