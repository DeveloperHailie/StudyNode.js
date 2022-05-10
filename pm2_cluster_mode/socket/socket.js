const socketIo = require('socket.io');
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const socketConfig = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    allowEIO3: true,
};

const pubClient = createClient({ url: "redis://localhost:6379" });
pubClient.on('connect', () => console.log('Connected to pubClient!'));
pubClient.connect();
const subClient = pubClient.duplicate();
subClient.on('connect', () => console.log('Connected to subClient!'));
subClient.connect();

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);
    io.adapter(createAdapter(pubClient, subClient)); // 다중 인스턴스간 데이터 공유
    io.on('connection', async (socket) => {
        socket.on('message', (data) => {
            io.emit('message',{process:process.pid, data}); //모두에게 메시지 전송
        });
        socket.on('send room',(data)=>{
            io.to(data.roomId).emit("send room",{process:process.pid}); //roomId방에 메시지 전송
        });
        socket.on('join room',(data)=>{
            socket.join(data.roomId); //roomId방에 join
        })
        socket.on('disconnect', () => {
            clearInterval(socket.interval);
        });
    });  
};
