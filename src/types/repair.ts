export type RepairStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Repair {
  id: string;
  customerName: string;
  contactNumber: string;
  deviceType: string;
  deviceModel: string;
  problemDesc: string;
  repairCost: number;
  technicianCost: number;
  profit: number;
  status: RepairStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRepairInput {
  customerName: string;
  contactNumber: string;
  deviceType: string;
  deviceModel: string;
  problemDesc: string;
  repairCost: number;
  technicianCost: number;
}

export interface UpdateRepairInput {
  status?: RepairStatus;
  repairCost?: number;
  technicianCost?: number;
}