const { Router } = require("express");
const router = Router();
const ctrl = require("./admin.ctrl");

router.get("/", ctrl.showMainPage); // 메인 페이지 표시

router.get("/:lang", ctrl.showHandlerPage); // 검색 페이지 표시

router.post("/:lang", ctrl.createFunc); // 등록

router.put("/:lang", ctrl.updateFunc); // 수정

router.delete("/:lang", ctrl.deleteFunc); // 삭제

module.exports = router;
