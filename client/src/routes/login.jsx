import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { loginSuccess } from "../state/userSlice";
import ErrorCodes from "../lib/error-codes";
import Form from "../components/Form";

const loginSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string({ error: "password is required" }),
});

function Login() {
  const fields = [
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
    if (code === ErrorCodes.NOT_FOUND || ErrorCodes.INVALID_CREDENTIALS) {
      setError(error);
    } else {
      setError(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <Form
        fields={fields}
        schema={loginSchema}
        submitPath="/auth/login"
        onSuccess={handleSuccess}
        onError={handleError}
      />
      {error && <div>{error}</div>}
      <div>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
