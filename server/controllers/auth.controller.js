import ErrorCodes from "../lib/error-codes.js";
import { Channel, User } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { fail, ok } from "../utils/response.js";

export async function handleRegister(req, res, next) {
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

export async function handleLogin(req, res, next) {
  const { email, password } = req.validatedBody;
  try {
    // check if user exists
    const existingUser = await User.findOne({ email })
      .populate({
        path: "channels",
        select: "name avatar createdAt",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
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

    const subscriptions = await Channel.find({ subscribers: existingUser._id })
      .select("name avatar")
      .lean();

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
        subscriptions,
      },
      200
    );
  } catch (err) {
    next(err);
  }
}

export async function isUsernameAvailable(req, res, next) {
  try {
    const { username } = req.params;
    const exists = await User.exists({ username });
    if (exists) {
      return fail(res, ErrorCodes.CONFLICT, `${username} already exists`, 409);
    }
    ok(res, `${username} is available`, null, 200);
  } catch (err) {
    next(err);
  }
}
