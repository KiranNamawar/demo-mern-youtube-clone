import { Router } from "express";
import z from "zod";
import {
  handleLogin,
  handleRegister,
  isUsernameAvailable,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validation.js";

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

const router = Router();

router.post("/register", validateBody(registerSchema), handleRegister);
router.post("/login", validateBody(loginSchema), handleLogin);
router.get("/check-username/:username", isUsernameAvailable);

export default router;
