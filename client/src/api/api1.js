
/**
 * StartupConnect — API Service Layer (REAL BACKEND)
 * -------------------------------------------------
 * .env me set karo (frontend project root me):
 *   VITE_API_URL=http://localhost:5000/api
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
 
// filters: { query, type, mode, minSalary, minExperience, page, limit }
export async function fetchJobs(filters = {}, token) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      params.set(key, value);
    }
  });
  const res = await fetch(`${BASE_URL}/jobs?${params}`, {
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}
 
export async function fetchJobById(id, token) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}
 
export async function toggleSaveJob(id, token) {
  const res = await fetch(`${BASE_URL}/jobs/${id}/save`, {
    method: "POST",
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}
 
export async function fetchSavedJobs(token) {
  const res = await fetch(`${BASE_URL}/jobs/saved/all`, {
    headers: { ...authHeaders(token) },
  });
  return handleResponse(res);
}
 
// payload: { coverLetter, expectedSalary }
export async function applyToJob(id, payload, token) {
  const res = await fetch(`${BASE_URL}/jobs/${id}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
 
/* ============================= DASHBOARD ============================= */
 
export async function fetchDashboard(token) {
  const res = await fetch(`${BASE_URL}/dashboard`, {
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
 
export async function uploadResume(file, token) {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await fetch(`${BASE_URL}/users/me/resume`, {
    method: "POST",
    headers: { ...authHeaders(token) }, // Content-Type mat set karo, FormData khud boundary set karega
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