export interface AccessReview {
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  completionRate: number;
  nextCampaign: string;
}