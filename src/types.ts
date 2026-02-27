export type MemberStatus = 'Active' | 'Inactive' | 'Pending';
export type MemberType = 'Team' | 'MAGSO Member';
export type TaskStatus = 'Pending' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';
export type PaymentMode = 'Cash' | 'AirtelMoney' | 'TnM';

export interface Member {
  Name: string;
  Email: string;
  Reg_Number: string;
  Program: string;
  Year: number | string;
  Role: string;
  Total_Owed: number;
  Status: MemberStatus;
  Type?: MemberType;
}

export interface Transaction {
  Date: string;
  Member_Name: string;
  Activity: string;
  Amount: number;
  Mode: PaymentMode;
  Verified_By_Treasurer: 'Yes' | 'No';
}

export interface Task {
  Task_Name: string;
  Assigned_To: string;
  Due_Date: string;
  Status: TaskStatus;
  Priority: Priority;
}

export interface Event {
  Date: string;
  Name: string;
  Description: string;
  Location: string;
}

export interface DashboardStats {
  totalCollected: number;
  outstandingPledges: number;
  recentActivity: Transaction[];
}
