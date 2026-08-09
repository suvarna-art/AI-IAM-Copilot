export interface AccessControl {
  identity_id: string;
  username: string;
  display_name: string;
  department: string;
  access_count: number;
  privileged: boolean;
  risk_level: string;
  access_status: string;
}