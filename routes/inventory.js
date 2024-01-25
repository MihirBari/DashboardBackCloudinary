const express = require("express");
const { Details,History } = require("../controller/inventory");
const router = express.Router();


router.get("/details", Details);
router.get('/history', History);

module.exports = router;