import api from "./client";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload)
};

export const complaintApi = {
  create: (payload) => api.post("/complaints", payload),
  mine: () => api.get("/complaints/mine"),
  getById: (id) => api.get(`/complaints/${id}`),
  reopen: (id) => api.put(`/complaints/${id}/reopen`),
  rate: (id, payload) => api.put(`/complaints/${id}/rating`, payload)
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  reports: () => api.get("/admin/reports"),
  complaints: (params) => api.get("/admin/complaints", { params }),
  getComplaint: (id) => api.get(`/admin/complaints/${id}`),
  updateComplaint: (id, payload) => api.put(`/admin/complaints/${id}`, payload),
  updateComplaintStatus: (id, payload) => api.put(`/admin/complaints/${id}/status`, payload),
  deleteComplaint: (id) => api.delete(`/admin/complaints/${id}`),
  users: () => api.get("/admin/users"),
  officers: (city) => api.get("/admin/officers", { params: city ? { city } : {} }),
  createDepartment: (payload) => api.post("/admin/departments", payload),
  createOfficer: (payload) => api.post("/admin/officers", payload)
};

export const departmentApi = {
  list: (city) => api.get("/departments", { params: city ? { city } : {} })
};

export const notificationApi = {
  list: () => api.get("/notifications")
};

export const uploadApi = {
  image: (formData) =>
    api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  video: (formData) =>
    api.post("/uploads/video", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
};
