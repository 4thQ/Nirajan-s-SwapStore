import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  verifyToken: String,
  verifyTokenExpiry: String,
  forgetPasswordToken: String,
  forgetPasswordTokenExpiry: String,
  image: String,
});

// Hash password before saving user to database
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// To comare Password
userSchema.methods.isPasswordCorrect = async function (rawPassword) {
  return await bcrypt.compare(rawPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
