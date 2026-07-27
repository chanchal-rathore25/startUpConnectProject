/**
 * StartupConnect — API Service Layer (REAL BACKEND)
 * -------------------------------------------------
 * Ye file poore app ke liye backend se baat karne ka single point hai.
 * Sab kuch actual Express + MongoDB backend se fetch/save hota hai —
 * koi mock data nahi hai.
 *
 * .env me set karo (frontend project root me):
 *   VITE_API_URL=http://localhost:5000/api
 * (agar set nahi kiya to default localhost:5000/api use hoga)
 * -------------------------------------------------
 */

const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.message || "Kuch gadbad ho gayi. Baad me try karo.");
  }
  return data;
}

/* ============================= JOBS ============================= */

export async function fetchJobs({ query = "", type = "All" } = {}) {
  const params = new URLSearchParams({ query, type });
  const res = await fetch(`${BASE_URL}/jobs?${params}`);
  return handleResponse(res);
}

export async function fetchJobById(id) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  return handleResponse(res);
}

export async function applyToJob(id, token) {
  const res = await fetch(`${BASE_URL}/jobs/${id}/apply`, {
    method: "POST",
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}

/* ============================= AUTH ============================= */

export async function signupUser(form) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return handleResponse(res);
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

/* ============================= PROFILE ============================= */

export async function fetchMyProfile(token) {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}

export async function updateUserProfile(patch, token) {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(patch),
  });
  return handleResponse(res);
}

// file: browser File object (from <input type="file">)
export async function uploadResume(file, token) {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await fetch(`${BASE_URL}/users/me/resume`, {
    method: "POST",
    headers: { ...authHeaders(token) }, // Content-Type set mat karo, FormData khud boundary set karega
    body: formData,
  });
  return handleResponse(res);
}

export async function uploadPitchDeck(file, token) {
  const formData = new FormData();
  formData.append("pitchDeck", file);
  const res = await fetch(`${BASE_URL}/users/me/pitch-deck`, {
    method: "POST",
    headers: { ...authHeaders(token) },
    body: formData,
  });
  return handleResponse(res);
}