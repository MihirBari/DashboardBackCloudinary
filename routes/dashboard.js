const express = require("express");
const { TotalProducts,TotalProductsSold,TotalProductsLeft,TotalAmountCollected , TotalReturned, TotalAmountInvested, profit, size, TotalBankSettelment, TotalExpense} = require("../controller/dashboard");

const router = express.Router();

router.get("/TotalProducts", TotalProducts);
router.get("/TotalProductsSold", TotalProductsSold);
router.get("/TotalProductsLeft", TotalProductsLeft);
router.get("/TotalAmountCollected", TotalAmountCollected);
router.get("/TotalReturned", TotalReturned);
router.get("/TotalAmountInvested", TotalAmountInvested);
router.get("/profit", profit);
router.get("/size", size);
router.get("/TotalBankSettelment", TotalBankSettelment);
router.get("/TotalExpense", TotalExpense);

module.exports = router;