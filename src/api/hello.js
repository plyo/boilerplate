const { Router } = require("express");

const router = new Router();

/* eslint-disable no-use-before-define */
router.get("/", hello);
/* eslint-enable no-use-before-define */

async function hello(req, res, next) {
  try {
    res.status(200).send("Hello!");
  } catch (err) {
    next(err);
  }
}

module.exports = router;
