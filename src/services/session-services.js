import apiFetch from "./api-fetch.js";
import { tokenKey } from "../config.js";

export async function login(credentials = { email, password }) {
  console.log(credentials);
  const { token } = await apiFetch("login", { body: credentials });
  sessionStorage.setItem(tokenKey, token);

  // console.log(user);
  // return user;
}

export async function logout() {
  const data = await apiFetch("logout", { method: "DELETE" });
  sessionStorage.removeItem(tokenKey);

  return data;
}
