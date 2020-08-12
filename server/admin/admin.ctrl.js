const UserModel = require("../models/user.js");
const Ko_koModel = require("../models/kor_kor.js");
const Es_koModel = require("../models/esp_kor.js");
const Ru_koModel = require("../models/rus_kor.js");
const En_koModel = require("../models/eng_kor.js");
const mongoose = require("mongoose");
const { response } = require("express");

// id 유효성 체크
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

// 언어 선택
const selectLang = (req) => {
  let langkor,
    lang = req.params.lang,
    model;
  if (lang == "kor") {
    langkor = "국어";
    model = Ko_koModel;
  } else if (lang == "eng") {
    langkor = "영어";
    model = En_koModel;
  } else if (lang == "rus") {
    langkor = "러시아어";
    model = Ru_koModel;
  } else if (lang == "esp") {
    langkor = "스페인어";
    model = Es_koModel;
  } else {
    langkor = null;
    model = null;
  }
  return { langkor, lang, model };
};

const showMainPage = (req, res) => {
  let token = req.cookies.token;
  UserModel.findOne({ token }, (err, user) => {
    console.log(user);
    if (user.role == 1) return res.render("admin/index");
    else return res.redirect("/");
  });
};

const showHandlerPage = async (req, res) => {
  try {
    let { langkor, lang, model } = await selectLang(req);
    if (lang == null) res.redirect("search/");

    let token = req.cookies.token;
    console.log(token);
    UserModel.findOne({ token }, (err, user) => {
      if (err) return res.status(500).send("서버 오류");
      if (!user) return res.status(400).send("서버 측 오류");
      if (user.role != 1) return res.redirect("/");
      else {
        model
          .find((err, result) => {
            if (err) return res.status(500);
            else res.render("admin/handler", { langkor, lang, result });
          })
          .sort({ _id: -1 });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const createFunc = async (req, res) => {
  try {
    const { word, meaning, wordClass, stem } = req.body;
    if (!word || !meaning || !wordClass)
      return res.status(400).send("필수 입력값 미입력");
    console.log(
      "wordClass: ",
      wordClass,
      ", ",
      word,
      meaning + '입니다\n어근은 "',
      stem,
      '"입니다'
    );

    let { langkor, lang, model } = await selectLang(req);

    model.create({ word, meaning, class: wordClass, stem }, (err, result) => {
      if (err) return res.status(500).send("등록 오류 발생");
      console.log(result);
      res.end();
    });
  } catch (e) {
    console.log(e);
  }
};

const updateFunc = async (req, res) => {
  try {
    const { word, meaning, wordClass, stem, _id } = req.body;
    console.log(word, meaning, wordClass, stem, _id);
    if (!word || !meaning || !_id) return res.status(400).send("입력 오류");
    console.log(
      "_id: ",
      _id,
      "wordClass: ",
      wordClass,
      "\n",
      word,
      "를",
      meaning + '으로 변경합니다\n어근은 "',
      stem,
      '"입니다'
    );

    let { langkor, lang, model } = await selectLang(req);
    model.findByIdAndUpdate(
      _id,
      { word, meaning, class: wordClass, stem },
      { new: true },
      (err, result) => {
        if (err) return res.status(500).send("서버 오류 발생");
        if (!result) console.log(result);
        res.end();
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const deleteFunc = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    if (!_id) return res.status(400).send("입력 오류");
    console.log(_id, "을(를) 삭제합니다");

    let { langkor, lang, model } = await selectLang(req);
    model.findByIdAndRemove(_id, (err, result) => {
      if (err) return res.status(500).send("서버 오류");
      if (!result) return res.status(404).send("해당 정보 없음");
      res.end();
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  checkId,
  showMainPage,
  showHandlerPage,
  createFunc,
  updateFunc,
  deleteFunc,
};
