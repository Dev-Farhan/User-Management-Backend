import Joi from "joi";

const register = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).required(),
  address: Joi.string(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export { register, login };
