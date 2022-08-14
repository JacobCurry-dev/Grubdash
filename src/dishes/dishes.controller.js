const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data")); // Use the existing dishes data
const nextId = require("../utils/nextId"); // Use this function to assign ID's when necessary

// TODO: Implement the /dishes handlers needed to make the tests pass
const list = (req, res, next) => {
  res.json({ data: dishes });
};

const read = (req, res, next) => {
  res.json({ data: res.locals.dish });
};

const dishExists = (req, res, next) => {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${req.params.dishId}`,
  });
};

const isValidDish = (req, res, next) => {
  const { data } = req.body;

  const REQUIRED_FIELDS = ["name", "description", "price", "image_url"];
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Dish must include a ${field}`,
      });
    }
  }
  next();
};

const hasValidPrice = (req, res, next) => {
  const { data } = req.body;
  if (data.price < 0) {
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  if (typeof data.price !== "number") {
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
};

const idMatch = (req, res, next) => {
    const dishId = req.params.dishId;

    if (dish.id !== dishId) {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        })
    }
    next();
}

const create = (req, res, next) => {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

const update = (req, res) => {
  const { data: { name, description, price, image_url } = {} } = req.body;
  
  (res.locals.dish).name = name;
  (res.locals.dish).description = description;
  (res.locals.dish).price = price;
  (res.locals.dish).image_url = image_url;
  

  res.json({ data: res.locals.dish });
};

module.exports = {
  list,
  read: [dishExists, read],
  create: [isValidDish, hasValidPrice, create],
  update: [dishExists, isValidDish, hasValidPrice, update],
};
