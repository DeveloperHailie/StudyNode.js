const express = require('express');
const app = express();
const port = 3000;

// 처음에 들어오면 접속 및 연결, 스키마까지
const connect = require('./schemas');
connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const goodsRouter = require('./routers/goods');
app.use('/api', [goodsRouter]);

app.use((req, res, next) => {
    console.log(req);
    next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/test', (req, res) => {
    let name = req.query.name;
    res.render('test', { name });
});

app.get('/hi', (req, res) => {
    res.send('Hi. This is express router');
});

app.get('/', (req, res) => {
    res.send(
        '<!DOCTYPE html>\
    <html lang="en">\
    <head>\
        <meta charset="UTF-8">\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <title>Document</title>\
    </head>\
    <body>\
        Hi. I am with html<br>\
        <a href="/hi">Say Hi!</a>\
        <a href="/sample.png">sample.png</a>\
    </body>\
    </html>'
    );
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/detail', (req, res) => {
    res.render('detail');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
