const express = require("express");
const {
  order,
  updateOrder,
  updateOrder1,
  viewOneOrder,
  viewOrder,
  deleteOrder,
  OrderImage,
  creditorName,
  paidBy,
  city,
  orderID,
} = require("../controller/order");

const router = express.Router();

router.get(`/viewOrder`, viewOrder);
router.get(`/creditorName`, creditorName);
router.get(`/paidBy`, paidBy);
router.get(`/city`, city);
router.get(`/orderID`, orderID);
router.get(`/viewOneOrder/:order_id`, viewOneOrder);
router.post("/order", order);
router.put(`/updateOrder/:order_id`, updateOrder1);
router.delete("/delete", deleteOrder);
router.post(`/OrderImage`, OrderImage);

module.exports = router;
