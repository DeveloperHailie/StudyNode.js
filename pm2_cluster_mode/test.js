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
    sendMessageToProcess(
        0,
        {
            sendProcessInfo: {
                pid: process.pid,
                instanceId: process.NODE_APP_INSTANCE,
            },
            timerIdx: -1,
        },
        'test'
    );

    res.json({ result: '0번 프로세스에게 timerIdx가 -1인 test message 전송' });
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

process.on('message', function (message) {
    if (message.topic == 'start timer' || message.topic == 'test') {
      makePromise(message.data.timerIdx);
    } else if (message.topic == 'finish timer') {
      resolvePromise(message.data.timerIdx);
    } else if (message.topic == 'get map') {
      console.log(process.pid, Array.from(timerResolveMap.keys()));
    }
});

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
