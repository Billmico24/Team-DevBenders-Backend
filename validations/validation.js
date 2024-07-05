import Joi from "joi";

const specificDayValidation = Joi.object({
  date: Joi.string().required(),
  title: Joi.string().required(),
  weight: Joi.number().required(),
});

const productValidation = Joi.object({
  parameters: {
    height: Joi.number().required(),
    age: Joi.number().required(),
    currentWeight: Joi.number().required(),
    desiredWeight: Joi.number().required(),
    bloodType: Joi.string().required(),
  },
});

export { specificDayValidation, productValidation };
