export interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: number;
  riskLevel: string;
  status: string;
}

export async function getRoles(): Promise<Role[]> {
  // This function is intentionally not implemented here.
  // API access belongs in the service layer.
  return [];
}