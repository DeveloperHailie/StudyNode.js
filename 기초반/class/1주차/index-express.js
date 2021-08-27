const express = require('express');
const app = express();
const port = 3000;

// localhost:3000 으로 접속 시 (요청)
app.get('/', (req, res) => {
    res.send('Hello home World!');
});

// localhost:3000/hello 으로 접속 시 (요청)
app.get('/hello', (req, res) => {
    res.send('Hello hello World!');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

// 터미널 웹서버 중지 -> ctrl+c
