// src/auth.js
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  window.location.href = "/"; // or use navigate from React Router
};
