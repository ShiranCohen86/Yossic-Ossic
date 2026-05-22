import client from './client';

export interface Lesson { _id: string; student: { _id: string; name: string; email: string }|string; date: string; startTime: string; endTime: string; subject: 'math'|'physics'; topic?: string; status: 'pending'|'confirmed'|'completed'|'cancelled'; notes?: string; cancelReason?: string; }

export const lessonsApi = {
  list: async (params?: { status?: string; from?: string; to?: string; subject?: string }) => {
    const { data } = await client.get('/lessons', { params }); return data as { lessons: Lesson[] };
  },
  book: async (body: { date: string|Date; startTime: string; endTime: string; subject: string; topic?: string }) => {
    const { data } = await client.post('/lessons', body); return data as { lesson: Lesson };
  },
  confirm: async (id: string) => { const { data } = await client.patch(`/lessons/${id}/confirm`); return data as { lesson: Lesson }; },
  complete: async (id: string, notes?: string) => { const { data } = await client.patch(`/lessons/${id}/complete`, { notes }); return data as { lesson: Lesson }; },
  cancel: async (id: string, cancelReason?: string) => { const { data } = await client.patch(`/lessons/${id}/cancel`, { cancelReason }); return data as { lesson: Lesson }; },
};
