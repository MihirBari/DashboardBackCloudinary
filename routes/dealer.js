const express = require("express");
const { showDealer,addDealer, deleteSeller,editDealer ,showOneDealer,addImage,recieptImage} = require("../controller/dealer");

const router = express.Router();

router.get("/showDealer", showDealer);
router.get("/showOneDealer/:id", showOneDealer);
router.post("/addDealer", addDealer);
router.post('/upload', addImage);
router.put("/editDealer/:id", editDealer);
router.post(`/recieptImage`, recieptImage);
router.delete("/delete", deleteSeller);

module.exports = router;