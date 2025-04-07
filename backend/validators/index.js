import Joi from "joi";

export const signUpSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  location: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password"),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  location: Joi.string().required(),
  email: Joi.string().email().required(),
  image: Joi.string().allow("").optional(),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const addItemSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number.",
    "any.required": "Price is required.",
  }),
  discount: Joi.number().optional().allow("").messages({
    "number.base": "Discount must be a number.",
  }),
  type: Joi.object({
    buy: Joi.boolean().required(),
    rent: Joi.boolean().required(),
    swap: Joi.boolean().required(),
  })
    .required()
    .messages({
      "object.base": "Type must be an object with buy, rent, and swap properties.",
    }),
  rentPerDay: Joi.number()
    .optional()
    .allow("")
    .when("type.rent", {
      is: true,
      then: Joi.number().required().messages({
        "number.base": "Rent per day must be a number.",
        "any.required": "Rent per day is required when type is rent.",
      }),
      otherwise: Joi.optional().allow(""),
    }),
  swapWith: Joi.string()
    .optional()
    .allow("")
    .when("type.swap", {
      is: true,
      then: Joi.string().required().messages({
        "string.base": "Swap with must be a string.",
        "any.required": "Swap with is required when type is swap.",
      }),
      otherwise: Joi.optional().allow(""),
    }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required.",
  }),
  brand: Joi.string().required().messages({
    "string.empty": "Brand is required.",
  }),
  color: Joi.string().required().messages({
    "string.empty": "Color is required.",
  }),
  size: Joi.string().required().messages({
    "string.empty": "Size is required.",
  }),
  condition: Joi.string().required().messages({
    "string.empty": "Condition is required.",
  }),
  images: Joi.optional(),
});
