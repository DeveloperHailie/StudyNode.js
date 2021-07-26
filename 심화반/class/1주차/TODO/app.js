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
router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec(); // 내림차순

  res.send({ todos });
});

// 할 일 추가
router.post("/todos", async (req, res) => {
  const { value } = req.body;

  const maxOrderTodo = await Todo.findOne().sort("-order").exec(); // 내림차순 정렬
  let order = 1;

  if (maxOrderTodo) {
    order = maxOrderTodo.order + 1;
  }

  const todo = new Todo({ value, order });
  await todo.save();

  res.send({ todo });
});

// 할 일 일부 수정
// /todos/23
router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, value, done } = req.body;

  const todo = await Todo.findById(todoId).exec();

  if (order) { // 우선 순위 변경
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) { // 우선 순위 교환할 todo
      targetTodo.order = todo.order;
      await targetTodo.save();
    }
    todo.order = order;
  } else if (value) { // 할 일 내용 변경
      todo.value = value; 
  } else if (done !== undefined) { // 했음 / 안했음 
    // true일 때, false일 때 둘다 처리 필요
    todo.doneAt = done ? new Date() : null;
  }

  await todo.save();

  res.send({});
});

//할 일 삭제
// /todos/23
router.delete("/todos/:todoId", async (req,res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();
  await todo.delete();

  res.send({});
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});