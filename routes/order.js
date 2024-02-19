const express = require("express");
const { order, updateOrder,updateOrder1,viewOneOrder, viewOrder,deleteOrder, OrderImage} = require("../controller/order");

const router = express.Router();

router.get(`/viewOrder`, viewOrder);
router.get(`/viewOneOrder/:order_id`, viewOneOrder);
router.post("/order", order);
router.put(`/updateOrder/:order_id`, updateOrder1);
router.delete("/delete", deleteOrder);
router.post(`/OrderImage`, OrderImage);

module.exports = router;