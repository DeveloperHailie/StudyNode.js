const express = require("express"); //http 기반을 코드 덧붙여서 만든, http를 상속받는, 라이블러ㅣ
const Http = require("http"); //node.js에서 기본적으로 제공하는 웹서버 모듈
const socketIo = require("socket.io");

// http 서버와 express 서버(http 기반으로 만들어져서)를 합칠 수가 있다.
// express 서버와 socketIo 둘다 쓰는데 
// 이 둘을 합쳐주는 기반은 http 서버이다.
const app = express();
// 다른 http 서버 받아서 확장
const http = Http.createServer(app); 
// http서버에다가 socketIo를 연결하는 라우터를 알아서 붙여줌 
const io = socketIo(http, {
    // 규칙
    cors: { // 여기 명시된 서버, 호스트만 내 서버로 연결 허용, 이외에 같은 도메인의 서버는 가능
        origin: "*", //전체
        methods: ["GET", "POST"] //get과 post만 허용 
    }
}); // 3000번 포트로

app.get("/test", (req,res) => {
    res.send("express 잘 켜져 있습니다.");
});

// 위에선 서버 생성한거고. 이제 listen
http.listen(3000, ()=>{
    console.log("서버가 켜졌습니다.");
});

io.on("connection", (socket) => { // connection 되면 소켓 하나 할당, 연결될 때마다 고유 소켓 생긴다 생각
    console.log("연결이 되었습니다.");

    socket.send("너 연결 잘 됐다."); // 소켓에게 보냄, 얜 key값 message
    socket.emit("customEventName", "새로운 이벤트인가?"); //얜 key값 명시해줘야 함
}); //서버 죽더라도 클라이언트는 연결될때까지 계속 연결 한대
