export type GovernanceAction = {
  type: "overdue" | "pending";
  count: number;
  title: string;
  description: string;
};
export interface AccessReview {
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  completionRate: number;
  nextCampaign: string;
}