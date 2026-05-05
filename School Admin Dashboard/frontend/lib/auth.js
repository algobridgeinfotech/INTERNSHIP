"use client";

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user") || localStorage.getItem("admin");
  return raw ? JSON.parse(raw) : null;
};

export const getStoredAdmin = getStoredUser;

export const saveAuth = ({ token, user, admin }) => {
  const currentUser = user || admin;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(currentUser));
  localStorage.setItem("admin", JSON.stringify(currentUser));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
};

export const hasToken = () => typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
export const isAdmin = () => getStoredUser()?.role === "admin";
export const isTeacher = () => getStoredUser()?.role === "teacher";
