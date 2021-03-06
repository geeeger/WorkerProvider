/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import WorkerProvider from "../src/index";
import { WorkerMessage } from "../src/interface";

class Worker {
    public path: string;
    constructor(path: string) {
        this.path = path;
    }

    public onmessage(_e) {
        // rewrite
    }

    public postMessage(message: any) {
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

interface FakeWindow {
    [key: string]: any;
}

declare var window: FakeWindow;

window.Worker = Worker;

it("worker-provider should work", (done) => {
    const wp = new WorkerProvider("./fakepath");
    wp.on("test", (error, data) => {
        if (!error) {
            expect(data).toBe(1);
        }
    });

    wp.send({
        channel: "test",
        payload: 1,
    });
    wp.send({
        channel: "test",
        payload: 1,
    });
    wp.send({
        channel: "test",
        payload: 1,
    });
    wp.send({
        channel: "test",
        payload: 1,
    });
    wp.send({
        channel: "test",
        payload: 1,
    });

    setTimeout(() => {
        wp.destroy();
        expect(wp.workers).toBeNull();
        done();
    }, 1000);
});

it("if hardwareConcurrency is undefined", (done) => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
        get() {
            return undefined;
        },
    });
    const wp = new WorkerProvider("./fakepath");
    expect(wp.cpus).toBe(1);
    done();
});

// JSDOM does not implement URL.createObjectURL

Object.defineProperty(window.URL, "createObjectURL", {
    value: () => {
        return "fake";
    },
});

it("static isTransferablesSupported()", () => {
    // because Worker is mocked
    expect(WorkerProvider.isTransferablesSupported()).toBeFalsy();
});

it("static asyncFnMover()", () => {
    expect(typeof WorkerProvider.asyncFnMover(function calc(data: WorkerMessage) {
        let payload = data.payload;
        const channel = data.channel;
        payload++;
        return Promise.resolve({
            channel,
            payload,
        });
    })).toBe("string");
});

it("removeMessage()", () => {
    const wp = new WorkerProvider("./fakepath");
    const messages = [
        [{
            channel: "test",
            payload: 1,
        }],
        [{
            channel: "test1",
            payload: 1,
        }],
        [{
            channel: "test",
            payload: 1,
        }],
        [{
            channel: "test",
            payload: 1,
        }],
        [{
            channel: "test2",
            payload: 1,
        }],
    ];
    wp.messages = [].concat(messages);
    wp.removeMessagesByChannel("test");
    expect(wp.messages[0]).toEqual(messages[1]);
    wp.removeMessage(messages[1][0]);
    expect(wp.messages.length).toBe(1);
    wp.removeMessage(messages[1][0]);
    expect(wp.messages.length).toBe(1);
    wp.messages = null;
    wp.removeMessagesByChannel("test");
    wp.removeMessage(messages[1][0]);
});
