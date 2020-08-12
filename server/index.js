const { Router } = require("express");
const router = Router();

router.use("/search", require("./search")); // index는 안써도 알아서 찾음
router.use("/admin", require("./admin"));
router.use("/user", require("./user"));
router.use("/myPage", require("./myPage"));

module.exports = router;
