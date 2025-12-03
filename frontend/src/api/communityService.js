import api from "./api";

export const getPosts = async () => {
  const res = await api.get("/community");
  return res.data;
};

export const createPost = async (post) => {
  const res = await api.post("/community", post);
  return res.data;
};

export const addReply = async (id, reply) => {
  const res = await api.post(`/community/${id}/reply`, { reply });
  return res.data;
};
