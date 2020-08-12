const mongoose = require("mongoose");

const esp_korSchema = new mongoose.Schema({
  word: {
    type: String,
    index: "text",
    required: true,
    trim: true,
  },
  meaning: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: Number,
  },
  stem: {
    type: String,
  },
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("esp_kor", esp_korSchema); //("music", MusicSchema, "musics") 이렇게 세번째 인자로 컬렉션 명 설정가능
