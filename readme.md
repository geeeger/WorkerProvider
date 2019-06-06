# WorkerProvider

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/12ae8b47df824f3ebd55ce4b10958589)](https://app.codacy.com/app/geeeger/WorkerProvider?utm_source=github.com&utm_medium=referral&utm_content=geeeger/WorkerProvider&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/geeeger/WorkerProvider.svg?branch=master)](https://travis-ci.org/geeeger/WorkerProvider) [![gzip](https://badge-size.herokuapp.com/geeeger/WorkerProvider/master/lib/index.min.js?compression=gzip&style=flat-square)](https://github.com/geeeger/WorkerProvider/tree/master/lib) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/geeeger/WorkerProvider/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/worker-provider.svg?style=flat)](https://www.npmjs.com/package/worker-provider) [![npm download](https://img.shields.io/npm/dw/worker-provider.svg)](https://www.npmjs.com/package/worker-provider) ![](https://img.shields.io/codecov/c/github/geeeger/WorkerProvider.svg) [![](https://data.jsdelivr.com/v1/package/npm/worker-provider/badge)](https://www.jsdelivr.com/package/npm/worker-provider)

## Usage

```javascript
const wp = new WorkerProvider('./worker/path.js');
wp.on('channelName', (payload) => {
    console.log(payload);
});

// send one message to idle workers
wp.send({
    channel: 'channelName',
    payload: 'anydata'
});

// destory it
wp.destroy();

// if your browser support transferable object
if (WorkerProvider.isTransferablesSupported()) {
    const transferableObj = new Uint8Array(1);
    wp.send({
        channel: 'channelName',
        payload: transferableObj
    }, [ transferableObj.buffer ]);
}

// if you need make a worker to do some thing
var yourAction = WorkerProvider.asyncFnMover(function calc(data) {
    var payload = data.payload;
    var channel = data.channel;
    payload++;
    return Promise.resolve({
        channel: channel,
        payload: payload
    });
};
const wp1 = new WorkerProvider(yourAction);
wp1.on('plus1', (payload) => {
    console.log(payload);
});
wp1.send({
    channel: 'plus1',
    payload: 1
});
```

## declaration

```typescript
import { EventEmitter } from "events";

export interface MyWorker {
    buzy: boolean;
    instance: Worker;
}
export interface WorkerMessage {
    channel: string;
    payload?: any;
}
export declare type WorkerMessages = [WorkerMessage, Transferable[]?];

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

export default class WorkerProvider extends EventEmitter implements WorkersProvider {
    static isTransferablesSupported(): boolean;
    static asyncFnMover(fn: (data: WorkerMessage) => Promise<WorkerMessage>): string;
    workers: MyWorker[];
    cpus: number;
    messages: WorkerMessages[];
    constructor(workerPath: string);
    onmessage(e: MessageEvent): void;
    run(): void;
    send(message: WorkerMessage, transfer?: Transferable[]): void;
    destroy(): void;
    removeMessage(message: WorkerMessage): void;
    removeMessagesByChannel(channel: string): void;
}

```

## ChangeLog

[here](./CHANGELOG.md)
