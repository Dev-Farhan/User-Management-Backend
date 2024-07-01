import Joi from "joi";

const updateUserProfile = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string().length(10),
  address: Joi.string(),
  zip: Joi.string(),
  state: Joi.string(),
  city: Joi.string(),
  dateOfBirth: Joi.string(),
  gender: Joi.string(),
});

export { updateUserProfile };
