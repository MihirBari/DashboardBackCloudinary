const express = require("express");
const { showExpense,showOneExpense,addExpense,editExpense,deleteExpense} = require("../controller/expense");

const router = express.Router();

router.get("/showExpense", showExpense);
router.get("/showOneExpense/:id", showOneExpense);
router.post("/addExpense", addExpense);
router.put("/editExpense/:id", editExpense);

router.delete("/delete", deleteExpense);

module.exports = router;