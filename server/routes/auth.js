import { Router } from "express";
import z from "zod";
import { validateBody } from "../middlewares/validation.js";
import User from "../models/User.js";
import { fail, ok } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import ErrorCodes from "../lib/error-codes.js";

const registerSchema = z.object({
  username: z
    .string({ error: "username is required" })
    .min(3, { error: "username must be at least 3 characters" })
    .max(30, { error: "username too long" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Only letters, numbers, _, - allowed",
    }),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string({ error: "password is required" })
    .min(8, { error: "password must be at least 8 characters" })
    .regex(/[a-z]/, {
      error: "password must contain at least 1 lowercase letter",
    })
    .regex(/[A-Z]/, {
      error: "password must contain at least 1 uppercase letter",
    })
    .regex(/[0-9]/, { error: "password must contain at least 1 number" }),
  avatar: z.url({ error: "Invalid url" }).optional(),
});

const loginSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string({ error: "password is required" }),
});

async function handleRegister(req, res, next) {
  const { username, email, password, avatar } = req.validatedBody;
  try {
    // check if user exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return fail(
        res,
        ErrorCodes.EMAIL_EXISTS,
        "Account already exists. Try login.",
        409
      );
    }

    // create new user with hased password
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    // jwt to autologin after signup
    const accessToken = generateToken({ id: newUser._id });

    return ok(
      res,
      "User Created Successfully",
      {
        id: newUser._id,
        email: newUser.email,
        avatar: newUser.avatar,
        username: newUser.username,
        channels: newUser.accessToken,
        accessToken,
      },
      201
    );
  } catch (err) {
    next(err);
  }
}

async function handleLogin(req, res, next) {
  const { email, password } = req.validatedBody;
  try {
    // check if user exists
    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser) {
      return fail(
        res,
        ErrorCodes.NOT_FOUND,
        "User doesn't exists. Try signup.",
        404
      );
    }

    // compare password with password hash from db
    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return fail(
        res,
        ErrorCodes.INVALID_CREDENTIALS,
        "Invalid credentials",
        401
      );
    }

    // generate jwt
    const accessToken = generateToken({ id: existingUser._id });

    return ok(
      res,
      "Login Successful",
      {
        id: existingUser._id,
        email: existingUser.email,
        avatar: existingUser.avatar,
        username: existingUser.username,
        channels: existingUser.channels,
        accessToken,
      },
      200
    );
  } catch (err) {
    next(err);
  }
}

const router = Router();

router.post("/register", validateBody(registerSchema), handleRegister);
router.post("/login", validateBody(loginSchema), handleLogin);

export default router;
