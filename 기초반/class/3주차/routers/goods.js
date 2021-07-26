const express = require("express");
const Goods = require("../schemas/Goods");

const router = express.Router();

// db에서 데이터 가져와서 json 형식으로 보내는 것까지
// goods 키워드 안에 goods 담아서 내려줌
router.get("/goods", async (req, res, next) => {
  try {
    const { category } = req.query;
    const goods = await Goods.find({ category }).sort("-goodsId");
    res.json({ goods: goods });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// : = 값을 goodsId라는 이름의 변수로 가져다 쓰겠다.
// /goods/1 => goodsId는 1
// detail 키워드 안에 goods 담아서 내려줌
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  goods = await Goods.findOne({ goodsId: goodsId });
  res.json({ detail: goods });
});

router.post('/goods', async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;
  
    isExist = await Goods.find({ goodsId });
    if (isExist.length == 0) {
      await Goods.create({ goodsId, name, thumbnailUrl, category, price });
    }
    res.send({ result: "success" });
  });

module.exports = router;