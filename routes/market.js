const express = require("express");
const { showMarket,showOneMarket,addMarket,editMarket,deleteMarket} = require("../controller/market");

const router = express.Router();

router.get("/showMarket", showMarket);
router.get("/showOneMarket/:id", showOneMarket);
router.post("/addMarket", addMarket);
router.put("/editMarket/:id", editMarket);

router.delete("/deleteMarket", deleteMarket);

module.exports = router;