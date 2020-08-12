const UserModel = require("../models/user.js");
const mongoose = require("mongoose");

const showMyPage = (req, res) => {
  token = req.cookies.token;
  UserModel.findOne({ token }, (err, user) => {
    if (err) return res.status(500).send("유저 식별 오류");
    if (!user) return res.status(400).send("유저 식별 오류");

    res.render("myPage", { user });
  });
};

module.exports = {
  showMyPage,
};
