const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { Op } = require('sequelize');

const { User } = require("./models"); 
//const Cart = require("./models/cart");
//const Goods = require("./models/goods")
const authMiddleware = require("./middlewares/auth-middleware");

mongoose.connect("mongodb://localhost/shopping-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), 
    confirmPassword: Joi.string().required() 
});
// 회원가입
router.post("/users", async (req, res) => {
    try {
        const {
            nickname, email, password, confirmPassword
        } = await postUsersSchema.validateAsync(req.body);

        if (password !== confirmPassword) { //validation
            res.status(400).send({ // Bad request
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.'
            });
            return;
        };

        const existUsers = await User.findAll({ //validation
            // email이나 nickname에 맞는 데이터가 있는지
            where:{
                [Op.or] : [{ nickname }, { email }],
            },
        });
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.'
            });
            return;
        }

        await User.create({ email, nickname, password });
    
        // 사용자 리소스 생성
        res.status(201).send({});

    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터의 형식이 올바르지 않습니다."
        });
    }

});

const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
// 로그인
router.post("/auth", async (req,res) => {
    try {
        // const { email, password } = req.body;
        const { email, password } = await postAuthSchema.validateAsync(req.body);
        const user = await User.findOne({ where: { email, password } });

        if (!user) {
            //401 인증 실패
            res.status(401).send({
                errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'
            });
            return;
        }

        const token = jwt.sign({ userId: user.userId }, "my-secret-key");
        res.send({
            token
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
    }
    
});

// 본인 정보 인증
router.get("/users/me", authMiddleware, async (req,res) => {
   const { user } = res.locals;
    res.send({
        user: {
            email: user.email,
            nickname: user.nickname
        }
    });
});

// 내 장바구니 목록 불러오기
router.get("/goods/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const myCart = await Cart.find({
        userId
    }).exec();
    
    // 최종 결과 : {"cart":[{"quantity":4, "goods":{}}, {"quantity":4, "goods":{}}]}
   
    let cartList = [];
    for(let i of myCart){
        let good = await Goods.findOne( {goodsId:i.goodsId} ).exec();
        cartList.push(
            {
                "quantity": i.quantity,
                "goods": good
            }
        );
    }

    res.send({ 
        "cart": cartList
    });
});


// 장바구니에 상품 담기.
// 장바구니에 상품이 이미 담겨있으면 갯수만 수정
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;
    const { quantity } = req.body;
    
    const myGoods = await Cart.findOne({ 
        userId,
        goodsId 
    }).exec();
    
    if(myGoods){
        myGoods.quantity = quantity;
        await myGoods.save();
    }else{
        const cart = new Cart({
            userId,
            goodsId,
            quantity,
          });
        await cart.save();
    }

    res.send({});
});

// 장바구니 항목 삭제
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;
    
    const myGood = await Cart.findOne({ userId, goodsId }).exec();
    if(myGood){
        await Cart.deleteOne(myGood);
    }

    res.send({});
});

// 모든 상품 가져오기, query
 /*
 * /api/goods
 * /api/goods?category=drink
 * /api/goods?category=drink2
 */
router.get("/goods", authMiddleware, async (req, res) => {
    const { category } = req.query;

    let goods;
    if(!category){ // 전체 조회
        goods = await Goods.find({}).sort("-goodsId").exec();
    }else{ // 특정 category 조회
        goods = await Goods.find({ category }).sort("-goodsId").exec();
    }

    res.send({goods:goods});
});

// 상품 하나 가져오기, param
router.get("/goods/:goodsId", authMiddleware, async (req, res) => {
    const { goodsId } = req.params;
    const goods = await Goods.findOne({ goodsId }).exec();
    // find는 배열 반환 

    if(!goods){
        res.status(400).send({ // Bad request
            errorMessage: '존재하지 않는 상품입니다.'
        });
    }
    
    res.send({
        goods
    });
});


app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.get('/detail', (req, res) => {
    res.render('detail');
})

app.get('/cart', (req,res) => {
    res.render('cart');
})

app.get('/order', (req,res) => {
    res.render('order');
})


app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});