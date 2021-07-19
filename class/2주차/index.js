const express = require('express')
const app = express()
const port = 3000

// 요청의 body 내용 이용하기 위해 추가한 미들웨어
// 이 public은 node가 돌아가는 위치에 있어야 함
// 만약 nodejs_2021디렉토리의 터미널에서 node sp_mall\index.js 시
// nodejs_2021\public\fileName.png 이렇게 있어야 함
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// 이미지/동영상 등 정적 파일 제공 위한 미들웨어
// public 폴더 내에 정적 파일들 있음

/*
기존 코드
app.get('/goods/list', (req, res) => {
    res.send('상품 목록 페이지')
})

app.get('/goods/detail', (req, res) => {
    res.send('상품 상세 페이지')
})
*/
const goodsRouter = require('./routes/goods');
// /goods 로 들어오면 goodsRouter 너가 처리해.
app.use('/goods', goodsRouter);

/*
app.get('/user/login', (req, res) => {
    res.send('로그인 페이지')
})

app.get('/user/register', (req, res) => {
    res.send('회원가입 페이지')
})
*/
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// 라우터에 들어오기전에 전처리하는 미들웨어
app.use((req, res, next) => {
    console.log(req);
    next(); // 이 미들웨어는 종료되어 다음 스텝으로 넘어가서
});

// 템플릿 엔진 사용 부분
// ejs라는 템플릿 엔진을 view 엔진으로 사용하겠다.
// view 경로는 여기다.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 
app.get('/test', (req, res) => {
  let name = req.query.name; // path?name=hailie&age=22, 여기서 name~22까지
  // test = 파일명
  // name = 우리가 템플릿에 넘길 데이터
  res.render('test', {name}); 
})

app.get('/hi', (req, res) => {
    res.send('Hi. This is express router')
});

app.get('/', (req, res) => {
    res.send('<!DOCTYPE html>\
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
    </html>')
});

app.get('/home',(req, res) => {
    res.render('index');
})

app.get('/detail',(req,res)=>{
    res.render('detail');
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})