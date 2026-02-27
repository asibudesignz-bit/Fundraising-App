import { api } from './api';

interface PendingRequest {
  id: string;
  action: 'add' | 'update';
  sheet: string;
  data: any;
  idField?: string;
  idValue?: any;
  timestamp: number;
}

const STORAGE_KEY = 'magso_pending_sync';

export const syncService = {
  getQueue(): PendingRequest[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToQueue(request: Omit<PendingRequest, 'id' | 'timestamp'>) {
    const queue = this.getQueue();
    const newRequest: PendingRequest = {
      ...request,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };
    queue.push(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    console.log('Request added to sync queue:', newRequest);
  },

  async processQueue() {
    if (!navigator.onLine) return;
    
    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Processing sync queue (${queue.length} items)...`);
    const remaining: PendingRequest[] = [];

    for (const item of queue) {
      try {
        if (item.action === 'add') {
          if (item.sheet === 'Transactions') await api.addTransaction(item.data);
          else if (item.sheet === 'Tasks') await api.addTask(item.data);
          else if (item.sheet === 'Members') await api.addMember(item.data);
        } else if (item.action === 'update') {
          if (item.sheet === 'Tasks') await api.updateTask(item.idValue, item.data);
          else if (item.sheet === 'Members') await api.updateMember(item.idValue, item.data);
        }
        console.log(`Successfully synced item: ${item.id}`);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}, keeping in queue:`, error);
        remaining.push(item);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    
    if (remaining.length === 0) {
      console.log('Sync queue cleared!');
    }
  }
};
