import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: API_URL });

// export const fetchStartups = async (params = {}) => {
//   const { data } = await api.get("/startups", { params });
//   return data.data;
// };

export const fetchStartups = async () => {
  const { data } = await api.get("/startups");

  console.log("All Startups Response:", data);

  return data.data;
};

// export const fetchStartupById = async (id) => {
//   const { data } = await api.get(`/startups/${id}`);
//   return data.data;
// };

export const fetchStartupById = async (id) => {
  const { data } = await api.get(`/startups/${id}`);

  console.log("Single Startup Response:", data);

  return data.data;
};

export const applyToStartup = async (id) => {
  const { data } = await api.post(`/startups/${id}/apply`);
  return data.data;
};

export const toggleSaveStartup = async (id, saved) => {
  const { data } = await api.patch(`/startups/${id}/save`, { saved });
  return data.data;
};

export default api;
