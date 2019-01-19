import WorkerProvider from "../src/index";
class Worker {
    public path: string;
    constructor(path) {
        this.path = path;
    }

    public onmessage(fn) {
        // rewrite
    }

    public postMessage(message) {
        this.onmessage(new MessageEvent("message", {
            data: message,
        }));
    }
}

it("should exist", () => {
    const wp = new WorkerProvider();
    expect(wp).toBeDefined();
});
