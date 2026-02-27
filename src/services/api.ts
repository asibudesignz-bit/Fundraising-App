import { Member, Transaction, Task, Event } from '../types';
import { syncService } from './syncService';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const api = {
  async getMembers(): Promise<Member[]> {
    if (!SCRIPT_URL) return mockMembers;
    try {
      const response = await fetch(`${SCRIPT_URL}?sheet=Members`);
      return response.json();
    } catch (error) {
      console.error('Fetch members failed:', error);
      return mockMembers;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    if (!SCRIPT_URL) return mockTransactions;
    try {
      const response = await fetch(`${SCRIPT_URL}?sheet=Transactions`);
      return response.json();
    } catch (error) {
      console.error('Fetch transactions failed:', error);
      return mockTransactions;
    }
  },

  async getTasks(): Promise<Task[]> {
    if (!SCRIPT_URL) return mockTasks;
    try {
      const response = await fetch(`${SCRIPT_URL}?sheet=Tasks`);
      return response.json();
    } catch (error) {
      console.error('Fetch tasks failed:', error);
      return mockTasks;
    }
  },

  async getEvents(): Promise<Event[]> {
    if (!SCRIPT_URL) return mockEvents;
    try {
      const response = await fetch(`${SCRIPT_URL}?sheet=Events`);
      return response.json();
    } catch (error) {
      console.error('Fetch events failed:', error);
      return mockEvents;
    }
  },

  async addTransaction(data: Partial<Transaction>) {
    if (!navigator.onLine) {
      syncService.addToQueue({ action: 'add', sheet: 'Transactions', data });
      return { success: true, offline: true };
    }
    if (!SCRIPT_URL) {
      console.log('Mock add transaction:', data);
      return { success: true };
    }
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'add',
          sheet: 'Transactions',
          data
        })
      });
      return { success: true };
    } catch (error) {
      syncService.addToQueue({ action: 'add', sheet: 'Transactions', data });
      return { success: true, offline: true };
    }
  },

  async addTask(data: Partial<Task>) {
    if (!navigator.onLine) {
      syncService.addToQueue({ action: 'add', sheet: 'Tasks', data });
      return { success: true, offline: true };
    }
    if (!SCRIPT_URL) {
      console.log('Mock add task:', data);
      return { success: true };
    }
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'add',
          sheet: 'Tasks',
          data
        })
      });
      return { success: true };
    } catch (error) {
      syncService.addToQueue({ action: 'add', sheet: 'Tasks', data });
      return { success: true, offline: true };
    }
  },

  async updateTask(taskName: string, data: Partial<Task>) {
    if (!navigator.onLine) {
      syncService.addToQueue({ action: 'update', sheet: 'Tasks', idField: 'Task_Name', idValue: taskName, data });
      return { success: true, offline: true };
    }
    if (!SCRIPT_URL) {
      console.log('Mock update task:', taskName, data);
      return { success: true };
    }
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'update',
          sheet: 'Tasks',
          idField: 'Task_Name',
          idValue: taskName,
          data
        })
      });
      return { success: true };
    } catch (error) {
      syncService.addToQueue({ action: 'update', sheet: 'Tasks', idField: 'Task_Name', idValue: taskName, data });
      return { success: true, offline: true };
    }
  },

  async addMember(data: Member) {
    if (!navigator.onLine) {
      syncService.addToQueue({ action: 'add', sheet: 'Members', data });
      return { success: true, offline: true };
    }
    if (!SCRIPT_URL) {
      console.log('Mock add member:', data);
      return { success: true };
    }
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'add',
          sheet: 'Members',
          data
        })
      });
      return { success: true };
    } catch (error) {
      syncService.addToQueue({ action: 'add', sheet: 'Members', data });
      return { success: true, offline: true };
    }
  },

  async updateMember(regNumber: string, data: Partial<Member>) {
    if (!navigator.onLine) {
      syncService.addToQueue({ action: 'update', sheet: 'Members', idField: 'Reg_Number', idValue: regNumber, data });
      return { success: true, offline: true };
    }
    if (!SCRIPT_URL) {
      console.log('Mock update member:', regNumber, data);
      return { success: true };
    }
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'update',
          sheet: 'Members',
          idField: 'Reg_Number',
          idValue: regNumber,
          data
        })
      });
      return { success: true };
    } catch (error) {
      syncService.addToQueue({ action: 'update', sheet: 'Members', idField: 'Reg_Number', idValue: regNumber, data });
      return { success: true, offline: true };
    }
  }
};

// Mock data for initial development and when URL is not set
const mockMembers: Member[] = [
  { Name: 'John Doe', Email: 'john@example.com', Reg_Number: 'BS/2023/001', Program: 'Computer Science', Year: 2, Role: 'Chairperson', Total_Owed: 5000, Status: 'Active', Type: 'Team' },
  { Name: 'Jane Smith', Email: 'jane@example.com', Reg_Number: 'BS/2023/002', Program: 'Business Admin', Year: 3, Role: 'Treasurer', Total_Owed: 0, Status: 'Active', Type: 'Team' },
  { Name: 'Alex Banda', Email: 'alex@example.com', Reg_Number: 'BS/2023/003', Program: 'Engineering', Year: 1, Role: 'Member', Total_Owed: 15000, Status: 'Active', Type: 'MAGSO Member' },
  { Name: 'Sarah Phiri', Email: 'sarah@example.com', Reg_Number: 'BS/2023/004', Program: 'Social Science', Year: 2, Role: 'Member', Total_Owed: 2000, Status: 'Active', Type: 'MAGSO Member' },
];

const mockTransactions: Transaction[] = [
  { Date: '2024-03-20', Member_Name: 'John Doe', Activity: 'Membership Fee', Amount: 5000, Mode: 'Cash', Verified_By_Treasurer: 'Yes' },
  { Date: '2024-03-21', Member_Name: 'Alex Banda', Activity: 'Donation', Amount: 10000, Mode: 'AirtelMoney', Verified_By_Treasurer: 'No' },
];

const mockTasks: Task[] = [
  { Task_Name: 'Draft Proposal', Assigned_To: 'John Doe', Due_Date: '2024-04-01', Status: 'Pending', Priority: 'High' },
  { Task_Name: 'Contact Sponsors', Assigned_To: 'Jane Smith', Due_Date: '2024-03-25', Status: 'Done', Priority: 'Medium' },
];

const mockEvents: Event[] = [
  { Date: '2026-03-05', Name: 'Church Visit', Description: 'Fundraising visit to St. Peters', Location: 'St. Peters Cathedral' },
  { Date: '2026-03-12', Name: 'Car Wash', Description: 'Main campus car wash event', Location: 'Campus Parking' },
  { Date: '2026-02-27', Name: 'Shoe Polish Drive', Description: 'Quick shoe polish service', Location: 'Library Square' },
];
