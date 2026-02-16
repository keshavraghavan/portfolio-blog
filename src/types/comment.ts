export type Comment = {
  id: string;
  pageSlug: string;
  authorName: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  isApproved: boolean;
};
