const mongoose = require("mongoose");

const { Schema } = mongoose;
const cartSchema = new Schema({
    userId: {
        type : String,
        required : true
    },
    goodsId: {
        type : Number,
        required : true,
        unique : true
    },
    quantity: {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model("Cart", cartSchema);

