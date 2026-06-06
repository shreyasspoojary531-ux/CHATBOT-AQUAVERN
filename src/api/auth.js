import axios from "axios";

/**
 * Backend Contract:
 * - POST /login -> body: { username, password }
 * - POST /logout -> no body, refresh token sent via cookie
 * - POST /refresh -> body: { user_id }
 */

export const loginApi = async (username, password) => {
  const response = await axios.post(
    "/login",
    { username, password },
    { withCredentials: true }
  );
  return response.data;
};

export const logoutApi = async () => {
  const response = await axios.post(
    "/logout",
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const refreshApi = async (user_id) => {
  const response = await axios.post(
    "/refresh",
    { user_id },
    { withCredentials: true }
  );
  return response.data;
};
