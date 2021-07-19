const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const goodsRouter = require('./routes/goods');
const userRouter = require('./routes/user');

app.use('/goods', goodsRouter);
app.use('/user', userRouter);
app.use((req, res, next) => {
    console.log(req);
    next();
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/test', (req, res) => {
    let name = req.query.name;
    res.render('test', { name });
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

app.get('/home', (req, res) => {
    res.render('index');
})

app.get('/detail', (req, res) => {
    res.render('detail');
})

const mongoose = require('mongoose');

app.get('/mongodb', async (req, res) => {
    await mongoose.connect('mongodb://localhost/voyage', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    });

    const { Schema } = mongoose;
    const goodsSchema = new Schema({
        // 어떤 컬럼들이 필요하냐
        goodsId: {
            type : Number,
            required : true, // 이 값이 꼭 필요한 정보냐
            unique : true // goddsId값이 unique해야하냐
        },
        name: {
            type : String,
            required : true,
            unique : true
        },
        thumbnailUrl: {
            type : String
        },
        category: {
            type : String
        },
        price: {
            type: Number
        }
    });

    let Goods = mongoose.model("Goods",goodsSchema);

    await Goods.create({
        goodsId: 1,
        name: "맛있는 저녁",
        thumbnailUrl: "https://ppss.kr/wp-content/uploads/2019/08/0-87.jpg",
        category: "food",
        price: 5000
    });

    res.send('ok');
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})