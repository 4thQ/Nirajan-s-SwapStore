import config from "../config/index.js";
import User from "../models/userModel.js";
import { ErrorService } from "../services/ErrorService.js";
import tokenService from "../services/TokenService.js";
// import sendMail from "../services/mailer.js";
import uploadFile from "../services/uploadFile.js";
import { signInSchema, signUpSchema, updateProfileSchema } from "../validators/index.js";

class AuthController {
  async signin(req, res, next) {
    //1. Validate Request
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { email, password } = value;
    try {
      //2. check user exists ?
      const user = await User.findOne({ email });
      if (!user) {
        return next(ErrorService.notFoundError("Email does not exist"));
      }
      //3. check password is correct ?
      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) {
        return next(ErrorService.badRequestError("Invalid credentials"));
      }
      // 4. Check email is verifid
      // if (!user.isEmailVerified) {
      //   return next(ErrorService.forbiddenError("Email not verified. Please verify your email."));
      // }
      //5.Generate tokens and Persist refresh token into db
      const payload = {
        _id: user._id,
        // isEmailVerified: user.isEmailVerified,
      };
      const newRefreshToken = await tokenService.persistRefreshToken(user._id);
      const accessToken = await tokenService.generateAccessToken(payload);
      const refreshToken = await tokenService.generateRefreshToken(
        payload,
        newRefreshToken._id
      );
      //6.Set access token and refresh token to cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, //1 hour
        sameSite: "none",
        secure: true,
        // domain: config.WEBSITE_DOMAIN_ONLY,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        sameSite: "none",
        secure: true,
        // domain: config.WEBSITE_DOMAIN_ONLY,
      });

      res.status(200).json({
        message: "User is login successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    // 1.Validate Request
    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { firstName, lastName, location, email, password } = value;
    try {
      // 2. Check email is already exist ?
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(ErrorService.alreadyExistError("Email is already exist."));
      }

      // 5. Save user into DB
      const newUser = new User({ firstName, lastName, location, email, password });
      await newUser.save();
      // 6. Send verification email*
      // await sendMail({
      //   emailType: "VERIFY",
      //   userID: newUser._id,
      // });
      return res.status(201).json({
        message: `Thanks for signing up!.`,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshTokens(req, res, next) {
    const { jti: tokenID, _id: userID } = req.data;
    // CHECK USER EXIST
    try {
      const user = await User.findById(userID);
      if (!user) {
        return next(ErrorService.badRequestError("User with the token could not found"));
      }

      const payload = {
        _id: user._id,
        // role: user.role,
      };
      // PERSIST REFRESH TOKEN INTO DATABASE
      const newRefreshToken = await tokenService.persistRefreshToken(user._id);
      // DELETE PREVIOUS REFRESH TOKEN
      await tokenService.deleteRefreshToken(tokenID);
      // GENERATE ACCESS AND REFRESH TOKEN
      const accessToken = await tokenService.generateAccessToken(payload);
      const refreshToken = await tokenService.generateRefreshToken(
        payload,
        newRefreshToken._id
      );

      // SET ACCESS AND REFRESH TOKEN INTO COOKIE
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      res.status(200).json({ message: "Tokens refresh successfully" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const jti = req.jti;
    try {
      res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      });
      res.clearCookie("refreshToken", {
        sameSite: "none",
        secure: true,
      });
      await tokenService.deleteRefreshToken(jti);
    } catch (error) {
      next(error);
    }
    res.status(200).json({ messsage: "User logout successfully" });
  }

  async self(req, res, next) {
    try {
      const user = await User.findById(req.userID, "-__v -password");
      return res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    // 1.Validate Request
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { firstName, lastName, location, email } = value;
    try {
      const user = await User.findById(req.userID);
      if (!user) {
        return next(ErrorService.notFoundError("User not found."));
      }
      // CHECK EMAIL IS SAME. IF NOT THEN CHECK NEW EMAIL IS ALREADY EXIST ?
      if (email !== user.email) {
        const isExist = await User.findOne({ email });
        if (isExist) {
          return next(ErrorService.alreadyExistError("Email is already exist."));
        }
      }
      let url;
      if (req.file) {
        url = await uploadFile(req.file);
        user.image = url;
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.location = location;
      user.email = email;
      await user.save();

      return res.status(201).json({
        message: `User profile updated successfully!.`,
      });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export default authController;
