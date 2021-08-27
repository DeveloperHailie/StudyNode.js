const socketIo = require('socket.io');
const http = require("./app");
const hashmap = require('hashmap');

const io = socketIo(http);
let socketIdMap = new hashmap.HashMap();

function initSocket(sock) {
    console.log('새로운 소켓이 연결됐어요!');

    // 특정 이벤트가 전달됐는지 감지할 때 사용될 함수
    function watchEvent(event, func) {
        sock.on(event, func);
    }

    // 연결된 모든 클라이언트에 데이터를 보낼때 사용될 함수
    function notifyEveryone(event, data) {
        io.emit(event, data);
    }

    return {
        watchBuying: () => {
            watchEvent('BUY', (data) => {
                const emitData = {
                    ...data,
                    date: new Date().toISOString(),
                };
                notifyEveryone('BUY_GOODS', emitData);
            });
        },

        watchByebye: () => {
            watchEvent('disconnect', () => {
                console.log(sock.id, '연결이 끊어졌어요!');
            });
        },
    };
}
io.on('connection', (socket) => {
    const { watchBuying, watchByebye } = initSocket(socket);

    watchBuying(); // BUY 이벤트
    watchByebye(); // disconnect 이벤트

    socket.on('CHANGED_PAGE', (data) => {
        thisPage = data;

        let idList = socketIdMap.get(thisPage) ? socketIdMap.get(thisPage) : [];
        idList.push(socket.id);
        socketIdMap.set(thisPage, idList);

        for (socketId of idList) {
            // 현재 url에 접속해 있는 사람들에게만 전송
            io.to(socketId).emit(
                'SAME_PAGE_VIEWER_COUNT',
                socketIdMap.get(thisPage).length
            );
        }
    });

});