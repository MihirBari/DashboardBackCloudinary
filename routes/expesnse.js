const express = require("express");
const { showExpense,showOneExpense,addExpense,editExpense,deleteExpense,addImage,recieptImage,paidBy} = require("../controller/expense");

const router = express.Router();

router.get("/showExpense", showExpense);
router.get("/showOneExpense/:id", showOneExpense);
router.get("/paidBy", paidBy);
router.post("/addExpense", addExpense);
router.put("/editExpense/:id", editExpense);
router.post('/upload', addImage);
router.post(`/recieptImage`, recieptImage);
router.delete("/delete", deleteExpense);

module.exports = router;