const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0, // 0: 일반사용자, 1: 관리자
  },
  token: {
    type: String,
  },
  isdark: {
    type: String,
  },
  history: {
    type: [String],
  },
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("user", UserSchema);
