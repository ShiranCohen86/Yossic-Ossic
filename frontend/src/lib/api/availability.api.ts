import client from './client';

export interface AvailabilitySlot { _id: string; dayOfWeek?: number; startTime: string; endTime: string; isRecurring: boolean; specificDate?: string; isActive: boolean; }
export interface OpenSlot { date: string; startTime: string; endTime: string; }

export const availabilityApi = {
  list: async () => { const { data } = await client.get('/availability'); return data as { slots: AvailabilitySlot[] }; },
  getOpenSlots: async () => { const { data } = await client.get('/availability/open-slots'); return data as { slots: OpenSlot[] }; },
  create: async (body: Partial<AvailabilitySlot>) => { const { data } = await client.post('/availability', body); return data as { slot: AvailabilitySlot }; },
  update: async (id: string, body: Partial<AvailabilitySlot>) => { const { data } = await client.put(`/availability/${id}`, body); return data as { slot: AvailabilitySlot }; },
  remove: async (id: string) => { await client.delete(`/availability/${id}`); },
};
