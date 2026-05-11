import api from "./api";

const reportService = {
  async submitReport({
    incidentType,
    description,
    photo,
    latitude,
    longitude,
    address,
  }) {
    const formData = new FormData();
    formData.append("incidentType", incidentType);
    formData.append("description", description);
    if (photo) formData.append("photo", photo);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (address) formData.append("address", address);

    return api.postForm("/reports", formData);
  },

  async getMyReports() {
    return api.get("/reports/my");
  },

  async getAllReports({ status, incidentType } = {}) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (incidentType) params.append("incidentType", incidentType);
    const query = params.toString() ? `?${params.toString()}` : "";
    return api.get(`/reports${query}`);
  },

  async getReport(id) {
    return api.get(`/reports/${id}`);
  },

  async updateStatus(id, { status, officialNotes }) {
    return api.patch(`/reports/${id}/status`, { status, officialNotes });
  },
};

export default reportService;
