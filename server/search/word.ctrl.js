const WordModel = require("../models/word.js");
const Ko_koModel = require("../models/kor_kor.js");
const Es_koModel = require("../models/esp_kor.js");
const Ru_koModel = require("../models/rus_kor.js");
const En_koModel = require("../models/eng_kor.js");
const UserModel = require("../models/user.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
  res.render("index");
};

const showSearchPage = async (req, res) => {
  try {
    let { langkor, lang, model } = await selectLang(req);
    if (langkor == null) res.redirect("/");
    console.log(langkor);
    res.render("search", { langkor, lang }); //
  } catch (e) {
    console.log(e);
  }
};

// 확인용 페이지
const showAllWords = (req, res) => {
  let { langkor, lang, model } = selectLang(req);
  model.find((err, result) => {
    if (err) return res.status(500);
    else res.render("search/search_all", { langkor, lang, result });
  });
};

// 단어 검색 시 목록 조회
const showSearchedPage = async (req, res) => {
  let wordparam = req.params.word;
  let wordReg = RegExp(req.params.word, "gi");
  console.log(wordReg);
  try {
    let { langkor, lang, model } = await selectLang(req);
    model.find(
      { $or: [{ word: wordReg }, { meaning: wordReg }] },
      (err, result) => {
        let noresult = false;
        if (err) return res.status(500).send("서버 에러");
        if (result[0] == null) {
          noresult = true;
        }
        console.log("Search Success");
        console.log(result, "와 ", noresult);

        res.render("search/search", {
          langkor,
          lang,
          result,
          noresult,
          wordparam,
        });
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const showDetailPage = async (req, res) => {
  try {
    let token = req.cookies.token;
    console.log(token);

    let _id = req.params._id;
    console.log(_id);

    let { langkor, lang, model } = await selectLang(req);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.redirect("/search/" + lang);
    }

    model.findById(_id, (err, word) => {
      if (err) return res.status(500);
      console.log(word._id);

      UserModel.findOne({ token }, (err, user) => {
        if (err) return res.status(500).send("유저 식별 오류");
        if (!user) return res.status(400).send("유저 식별 오류");

        let addWorddb = word.word + " " + word.meaning;
        console.log(addWorddb);

        let a = true;

        for (const worddb of user.history) {
          console.log("들어왔다", worddb, "와", addWorddb);
          if (worddb.toString() == addWorddb.toString()) {
            console.log("걸렸다");
            a = false;
            return res.render("search/detail", { langkor, lang, word });
          }
        }

        console.log(a);

        if (a) {
          UserModel.findByIdAndUpdate(
            user._id,
            { $push: { history: addWorddb } },
            (err, result) => {
              if (err)
                return res.status(500).send("히스토리 추가 중 오류 발생");
              if (!result)
                return res.status(400).send("히스토리 추가 중 오류 발생");
              console.log(result);
              console.log("SUCcesSSS");
              res.render("search/detail", { langkor, lang, word });
            }
          );
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const changeColor = (req, res) => {
  const { isdark } = req.body;
  console.log('"' + isdark + '"입니다.');
  if (!isdark) return res.status(400).send("잘못된 입력");

  const token = req.cookies.token;
  if (!token) return res.render("user/login");

  jwt.verify(token, "secretKey", (err, _id) => {
    if (err) return res.status(500).send("잘못된 토큰");
    UserModel.findByIdAndUpdate(_id, { isdark: isdark }, (err, result) => {
      if (err) return res.status(500).send("서버 오류 발생");
      console.log(result);
      res.end();
    });
  });
};

module.exports = {
  showMainPage,
  showSearchPage,
  showAllWords,
  showDetailPage,
  showSearchedPage,
  changeColor,
};
