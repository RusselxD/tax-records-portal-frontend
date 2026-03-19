import apiClient from "./axios-config";

export const fileAPI = {
  getFilePreview: async (fileId: string): Promise<Blob> => {
    const res = await apiClient.get(`/files/${fileId}/preview`, {
      responseType: "blob",
    });
    return res.data;
  },

  upload: async (
    clientId: string,
    file: File,
  ): Promise<{ id: string; name: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post(`/clients/${clientId}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
  },
};
