const { notStrictEqual } = require("assert");
const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));   // Use the existing order data
const nextId = require("../utils/nextId");  // Use this function to assigh ID's when necessary

// TODO: Implement the /orders handlers needed to make the tests pass
const list = (req, res, next) => {
    res.json({ data: orders });
}

const read = (req, res, next) => {
    res.json({ data: res.locals.order });
}

const orderExists = (req, res, next) => {
    const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `order id not found: ${req.params.orderId}`,
  });
};

const validateOrderStatus = (req, res, next) => {
    const { data } = req.body;
    if (data.status === pending) {
        next({
            status: 400,
            message: `An order cannot be deleted unless it is pending`
        });
        next();
    }
}

const destroy = (req, res, next) => {
    const { data } = req.body
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    if (index > -1) {
        orders.splice(index, 1);
    }
    res.sendStatus(204)
}

module.exports = {
    list,
    read: [orderExists, read],
    delete: [orderExists, validateOrderStatus, destroy],

}