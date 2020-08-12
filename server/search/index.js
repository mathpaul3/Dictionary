const { Router } = require("express");
const router = Router();
const ctrl = require("./word.ctrl");

router.get("/", ctrl.showMainPage); // 메인 페이지 표시
router.put("/changeColor", ctrl.changeColor); // 색상 테마 변경(다크, 라이트)

router.get("/:lang", ctrl.showSearchPage); // 검색 페이지 표시

router.get("/:lang/all", ctrl.showAllWords); // 모든 단어 표시(확인용)

router.get("/:lang/:word", ctrl.showSearchedPage); // 단어 검색

router.get("/:lang/:word/:_id", ctrl.showDetailPage); // 상세 내용 검색

module.exports = router;
