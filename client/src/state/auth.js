import { loginSuccess, logoutSuccess } from "./userSlice";

export const authPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // on loginSuccess store accessToken to localStorage
  if (loginSuccess.match(action)) {
    const { accessToken } = action.payload;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  }

  // on logoutSuccess remove accessToken from localStorage
  if (logoutSuccess.match(action)) {
    localStorage.removeItem("accessToken");
  }

  return result;
};
