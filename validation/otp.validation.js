import Joi from "joi";

const otp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

const resendOtpValidaion = Joi.object({
  email: Joi.string().email().required(),
});

export { otp,resendOtpValidaion };
