import client from './client';

export interface User { _id: string; name: string; email: string; role: 'teacher'|'student'; gradeLevel?: number; subjects?: string[]; isActive: boolean; phone?: string; }

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await client.post('/auth/login', { email, password });
    return data as { token: string; refreshToken: string; user: User };
  },
  getMe: async () => { const { data } = await client.get('/auth/me'); return data as { user: User }; },
  registerStudent: async (body: { name: string; email: string; password: string; gradeLevel: number; subjects: string[]; phone?: string }) => {
    const { data } = await client.post('/auth/register', body); return data as { user: User };
  },
  listStudents: async (params?: { subject?: string; grade?: number }) => {
    const { data } = await client.get('/auth/students', { params }); return data as { students: User[] };
  },
  updateStudent: async (id: string, body: Partial<User>) => {
    const { data } = await client.patch(`/auth/students/${id}`, body); return data as { user: User };
  },
};
