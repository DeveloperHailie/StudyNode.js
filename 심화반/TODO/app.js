const express = require("express");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", express.json(), router);
// /api 경로가 붙여져 있어야만, 
// express.json() 미들웨어로 json 받아드리고
// router라는 미들웨어에 연결된다.

// localhost:8080/api 로 요청해야 함
app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});