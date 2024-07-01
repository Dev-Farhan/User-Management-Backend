import { constants } from "../constant.js";

const validate = (schema, source = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[source]);
  if (error) {
    res.status(constants.VALIDATION_ERROR);
    next(new Error(error.details[0].message));
  } else {
    next();
  }
};

export default validate;
