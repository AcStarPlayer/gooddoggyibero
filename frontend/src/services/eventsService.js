import api from "../services/api";

export const getEvents = async (query = {}) => {
  // Si hay query params, los pasamos en la request para filtrado/paginación desde backend
  const config = Object.keys(query).length ? { params: query } : undefined;
  const res = await api.get("/events", config);
  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await api.post("/events", eventData);
  return res.data;
};

export const updateEvent = async (id, data) => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};
