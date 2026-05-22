import client from './client';

export interface Material { _id: string; title: string; description?: string; subject: 'math'|'physics'; topic?: string; gradeLevel?: number[]; fileType: 'pdf'|'image'|'link'; fileUrl?: string; fileName?: string; isActive: boolean; createdAt: string; }

export const materialsApi = {
  list: async (params?: { subject?: string; topic?: string; grade?: number; q?: string }) => {
    const { data } = await client.get('/materials', { params }); return data as { materials: Material[] };
  },
  create: async (body: FormData) => {
    const { data } = await client.post('/materials', body, { headers: { 'Content-Type': 'multipart/form-data' } }); return data as { material: Material };
  },
  update: async (id: string, body: Partial<Material>) => { const { data } = await client.patch(`/materials/${id}`, body); return data as { material: Material }; },
  remove: async (id: string) => { await client.delete(`/materials/${id}`); },
};
