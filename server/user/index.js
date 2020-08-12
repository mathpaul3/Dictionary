const { Router } = require("express");
const router = Router();
const ctrl = require("./user.ctrl");

router.get("/signup", ctrl.showSignupPage); // 회원가입 페이지 보여주기
router.get("/login", ctrl.showLoginPage); // 로그인 페이지 보여주기
router.get("/logout", ctrl.logout);

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

module.exports = router;
