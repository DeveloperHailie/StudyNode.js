const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); //User 모델
const authMiddleware = require('./middlewares/auth-middleware');

// shopping-demo라는 db 사용
mongoose.connect('mongodb://localhost/shopping-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();
const router = express.Router();

router.post('/users', async (req, res) => {
    const { nickname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        //validation
        // 400보다 낮은 값은 클라이언트에 입장에서 성공했다는 코드로 받아드림
        // 400dms Bad request
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        });
        return;
    }

    const existUsers = await User.find({
        //validation
        // email이나 nickname에 맞는 데이터가 있는지
        $or: [{ email }, { nickname }],
    }).exec();
    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return;
    }

    const user = new User({ email, nickname, password });
    await user.save();

    // 그냥 send하면 기본적으로 200 status code를 반환
    //res.send({});

    // 사용자라는 리소스가 생성
    // Rest API 원칙에 따르면 201이 적합
    res.status(201).send({});
});

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }).exec();

    if (!user) {
        //401 인증 실패
        res.status(401).send({
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.',
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, 'my-secret-key');
    res.send({
        token,
    });
});

// 저 경로로 들어오는 경우에만 authMiddleware가 붙는 거야.
router.get('/users/me', authMiddleware, async (req, res) => {
    console.log(res.locals);
    /*
    [Object: null prototype] {
        user: {
            _id: 60fff556c84f4732508a85a5,
            email: 'hailie',
            nickname: 'hailie1',
            password: 'hailie',
            __v: 0
        }
    }
    */
    const { user } = res.locals;
    res.send({
        user: {
            email: user.email,
            nickname: user.nickname,
        },
    });
});

app.use('/api', express.urlencoded({ extended: false }), router);
app.use(express.static('assets'));

app.listen(8080, () => {
    console.log('서버가 요청을 받을 준비가 됐어요');
});
