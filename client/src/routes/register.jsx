import { z } from "zod";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Form from "../components/Form";
import ErrorCodes from "../lib/error-codes";
import { loginSuccess } from "../state/userSlice";
import api from "../lib/api";

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
  avatar: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.url({ error: "Invalid url" }).optional()
  ),
});

function Register() {
  const fields = [
    {
      name: "username",
      type: "text",
      defaultValue: "",
      onInput: checkUsername,
    },
    { name: "avatar", type: "url", defaultValue: "" },
    { name: "email", type: "email", defaultValue: "" },
    { name: "password", type: "password", defaultValue: "" },
  ];
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  function handleSuccess(data) {
    dispatch(loginSuccess(data));
    navigate("/");
  }
  
  function handleError(code, error) {
    console.log(code, error);
    if (code === ErrorCodes.EMAIL_EXISTS) {
      setError(error);
    } else {
      setError(null);
    }
  }
  
  const timerRef = useRef(null);
  function checkUsername(evt) {
    const value = evt.target.value;
    clearTimeout(timerRef.current);
    setError(null);
    if (value.length < 3) return;
    timerRef.current = setTimeout(() => {
      api
        .get(`/auth/check-username/${encodeURIComponent(evt.target.value)}`)
        .then(setError(null))
        .catch((err) => {
          if (err?.response.data?.code === ErrorCodes.CONFLICT) {
            setError(err.response.data.error);
          }
        });
    }, 300);
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <Form
        fields={fields}
        schema={registerSchema}
        submitPath="/auth/register"
        onSuccess={handleSuccess}
        onError={handleError}
        submitButtonTitle="Register"
        disableSubmit={!!error}
      />
      {error && <div>{error}</div>}
      <div>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Register;
