import * as Yup from "yup";

export const signinSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const signupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  location: Yup.string().required("Location is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const profileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  location: Yup.string().required("Location is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export const addItemSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array()
    .of(Yup.string())
    .min(1, "At least one image is required") // Ensure at least one image is required
    .required("Images are required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
  discount: Yup.number().optional().positive("Discount must be positive"),
  type: Yup.object().shape({
    buy: Yup.boolean().required(),
    rent: Yup.boolean().required(),
    swap: Yup.boolean().required(),
  }),
  rentPerDay: Yup.number().when("type.rent", {
    is: true,
    then: (schema) => schema.required("Rent per day is required if renting"),
    otherwise: (schema) => schema.optional(),
  }),
  swapWith: Yup.string().when("type.swap", {
    is: true,
    then: (schema) => schema.required("Swap with is required if swapping"),
    otherwise: (schema) => schema.optional(),
  }),

  category: Yup.string().required("Category is required"),
  color: Yup.string().required("Color is required"),
  size: Yup.string().required("Size is required"),
  brand: Yup.string().required("Brand is required"),
  condition: Yup.string().required("Condition is required"),
});

export const updateItemSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
  discount: Yup.number().optional().positive("Discount must be positive"),
  type: Yup.object().shape({
    buy: Yup.boolean().required(),
    rent: Yup.boolean().required(),
    swap: Yup.boolean().required(),
  }),
  rentPerDay: Yup.number().when("type.rent", {
    is: true,
    then: (schema) => schema.required("Rent per day is required if renting"),
    otherwise: (schema) => schema.optional(),
  }),
  swapWith: Yup.string().when("type.swap", {
    is: true,
    then: (schema) => schema.required("Swap with is required if swapping"),
    otherwise: (schema) => schema.optional(),
  }),

  category: Yup.string().required("Category is required"),
  color: Yup.string().required("Color is required"),
  size: Yup.string().required("Size is required"),
  brand: Yup.string().required("Brand is required"),
  condition: Yup.string().required("Condition is required"),
});

export const buyOrderSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  message: Yup.string(),
});

export const rentOrderSchema = Yup.object({
  phoneNumber: Yup.string().required("Phone number is required."),
  address: Yup.string().required("Address is required."),
  message: Yup.string().optional(),
  rentDuration: Yup.number()
    .required("Rent duration is required.")
    .positive("Rent duration must be a positive number.")
    .integer("Rent duration must be an integer."),
});

export const swapOrderSchema = Yup.object({
  phoneNumber: Yup.string().required("Phone number is required."),
  address: Yup.string().required("Address is required."),
  message: Yup.string().optional(),
  swapWith: Yup.string().required("Swap with Item ID is required."),
});
