const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const Http = require('http');
const socket = require('./socket/socket');
const pm2 = require('pm2');
const morgan = require('morgan');

const server = Http.createServer(app);
socket(server, app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.json({ result: '연결 성공' });
});

app.get('/test', (req, res) => {
    sendMessageToProcess(0, { hi: 'hi' }, 'test');
    res.json({ result: 'pm2.sendDataToProcessId 0' });
});

app.get('/test2', (req, res) => {
    process.send({
        type: 'process:msg',
        data: {
            success: true,
        },
    });
    res.json({ result: 'process.send' });
});

app.get('/startTimer/:id', (req, res) => {
    const { id } = req.params;
    sendMessageToProcess(
        0,
        {
            sendProcessInfo: {
                pid: process.pid,
                instanceId: process.env.NODE_APP_INSTANCE,
            },
            timerIdx: Number(id),
        },
        'start timer'
    );

    res.json({});
});

app.get('/finishTimer/:id', (req, res) => {
    const { id } = req.params;
    sendMessageToProcess(
        0,
        {
            sendProcessInfo: {
                pid: process.pid,
                instanceId: process.env.NODE_APP_INSTANCE,
            },
            timerIdx: Number(id),
        },
        'finish timer'
    );
    res.json({});
});

app.get('/map', (req, res) => {
    const pid = process.pid;
    sendMessageToProcess(0, {}, 'get map');
    res.json({ pid, mapKeys: Array.from(timerResolveMap.keys()) });
});

const timerResolveMap = new Map(); // key: id
const makePromise = async (id) => {
    console.log('[makePromise]', id);

    let timerId;
    let promise = new Promise((resolve, reject) => {
        timerId = setTimeout(() => resolve('time out'), 10000 * 1000);
        timerResolveMap.set(id, resolve);
    });

    let result = await promise;
    clearTimeout(timerId);
    timerResolveMap.delete(id);
    console.log('[finishPromise]', id);
};
const resolvePromise = async (id) => {
    timerResolveMap.get(id)();
    timerResolveMap.delete(id);
    console.log('[resolvePromise]', id);
};

server.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

const sendMessageToProcess = (processId, data, topic) => {
    pm2.sendDataToProcessId(
        processId,
        {
            type: 'process:msg',
            data,
            topic,
        },
        (err, result) => {
            if (err) {
                console.log('[error]', err);
            }
        }
    );
};

process.on('message', function (message) {
    //pm2.sendDataToProcessId의 특정 프로세스에서
    if (message.topic == 'start timer') {
        makePromise(message.data.timerIdx);
    } else if (message.topic == 'finish timer') {
        resolvePromise(message.data.timerIdx);
    } else if (message.topic == 'get map') {
        console.log(process.pid, Array.from(timerResolveMap.keys()));
    } else if (message.topic == 'test') {
        if (message.data.res) {
            message.data.res.json({ data: 'hi' });
        } else {
            console.log('process.on', message.data);
        }
    }
});

pm2.launchBus((err, pm2_bus) => {
    //모든 프로세스에서 받음
    pm2_bus.on('process:msg', function (packet) {
        console.log('pm2 launchBus', packet);
    });
});
