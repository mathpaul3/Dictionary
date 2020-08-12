const { Router } = require("express");
const router = Router();
const ctrl = require("./myPage.ctrl");

router.get("/", ctrl.showMyPage); // 메인 페이지 표시

module.exports = router;
