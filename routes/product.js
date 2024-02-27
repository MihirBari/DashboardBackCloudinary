const express = require("express");
const { inventory, addProduct, deleteProduct, addImage, oneProduct, updateProduct,productId, sendImage, productType,wasteProduct } = require("../controller/product");
const { search } = require("../controller/search");
const { addHistory } = require("../controller/History");

const router = express.Router();


router.get("/wasteProduct", wasteProduct);
router.get("/inventory", inventory);
router.get(`/Product/:product_id`, oneProduct);
router.post("/addProduct", addProduct);
router.post("/addHistory", addHistory);
router.get("/productId", productId);
router.get("/productType", productType);
router.post("/Search", search);
router.delete("/delete", deleteProduct);
router.post('/upload', addImage);
router.put('/updateProduct/:product_id',updateProduct)
router.get(`/sendImage`, sendImage);


module.exports = router;