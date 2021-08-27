const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    value: String, //할 일
    doneAt: Date, //체크 한 시간
    order: Number, //우선순위
});

TodoSchema.virtual('todoId').get(function () {
    return this._id.toHexString();
});
TodoSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Todo', TodoSchema);
