'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils/common`);

const ID_MIN_VALUE = 1;

const schema = Joi.object({
  articleId: Joi.number().integer().min(ID_MIN_VALUE),
  commentId: Joi.number().integer().min(ID_MIN_VALUE)
});

const routeParamsValidator = (req, res, next) => {
  const params = req.params;

  const {error} = schema.validate(params);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(prepareErrors(error));
  }

  return next();
};

module.exports = routeParamsValidator;
