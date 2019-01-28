# WorkerProvider

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/12ae8b47df824f3ebd55ce4b10958589)](https://app.codacy.com/app/geeeger/WorkerProvider?utm_source=github.com&utm_medium=referral&utm_content=geeeger/WorkerProvider&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/geeeger/WorkerProvider.svg?branch=master)](https://travis-ci.org/geeeger/WorkerProvider) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/geeeger/WorkerProvider/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/worker-provider.svg?style=flat)](https://www.npmjs.com/package/worker-provider) [![npm download](https://img.shields.io/npm/dw/worker-provider.svg)](https://www.npmjs.com/package/worker-provider) ![](https://img.shields.io/codecov/c/github/geeeger/WorkerProvider.svg)

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

export interface IMyWorker {
    buzy: boolean;
    instance: Worker;
    [key: string]: any;
}

export interface IWorkerMessage {
    channel: string;
    payload?: any;
}

export interface IWorkersProvider extends EventEmitter {
    workers: IMyWorker[];
    cpus: number;
    messages: IWorkerMessage[];
    onmessage(e: any): void;
    send(message: IWorkerMessage, transfer?: Transferable[]): void;
    run(): void;
    destroy(): void;
}

```

## ChangeLog

[here](./CHANGELOG.md)
