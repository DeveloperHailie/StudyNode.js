const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo.js");

mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

// 할 일 목록 조회
router.get("/todos", async (req,res) => {
    const todos = await Todo.find().sort("-order").exec(); // 내림차순

    res.send({ todos });
    /**
     * {
     *  todos: {
     *      { todoId: '~~', value: '~~', order: 1, ...},
     *       ...
     *  }
     * }
     */
});

// 할 일 추가
router.post("/todos", async (req, res) => {
    const { value } = req.body; // 구조 분해 할당, destructoring
    // req.body = { value: 'value내용' }
    // value = 'value내용'

    const maxOrderTodo = await Todo.findOne().sort("-order").exec(); // 내림차순 정렬
    let order = 1; // 기본값
    
    if(maxOrderTodo){ //order가 있는 경우
        order = maxOrderTodo.order + 1;
    }
    
    const todo = new Todo({value, order});
    await todo.save();

    res.send({ todo });
});

//할 일 일부 수정
// /todos/23
router.patch("/todos/:todoId", async (req,res) => {
    const { todoId } = req.params;
    const { order } = req.body;
    // todoId 가진 애를 order값으로 수정하려 한다.

    // 내가 바꾸려는 todo 찾기
    const todo = await Todo.findById(todoId).exec();

    if (order) { 
        const targetTodo = await Todo.findOne({ order }).exec();
        if (targetTodo){ // 바꿀려는 타깃 투두 있는지 체크
            targetTodo.order = todo.order;
            await targetTodo.save();
        }
        todo.order = order;
        await todo.save();
    }

    res.send({}); // response 항상 내줘야 함. 안그러면 클라이언트에서 에러난다.
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});