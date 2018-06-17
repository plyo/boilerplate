const { Router } = require("express");

const router = new Router();

/* eslint-disable no-use-before-define */
router.get("/", hello);
/* eslint-enable no-use-before-define */

/**
 * @api {delete} /api/address/:id Delete address
 * @apiName DeleteAddress
 * @apiGroup Address
 * @apiUse ValidatedResponse
 *
 * @apiParam (GET params) {UUID} id
 * @apiSuccess (Success 204) 204 Empty Response
 * @apiError 404 Address is not found
 */
async function hello(req, res, next) {
  try {
    res.status(200).send("Hello!");
  } catch (err) {
    next(err);
  }
}

module.exports = router;
