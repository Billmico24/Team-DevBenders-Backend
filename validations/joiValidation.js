import Joi from "joi";

const specificDayValidation = Joi.object({
  date: Joi.string().required(),
  title: Joi.string().required(),
  weight: Joi.number().required(),
});

export { specificDayValidation };
