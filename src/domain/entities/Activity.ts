export class Activity {
  constructor(
    public activityId: number,
    public activityDetailId?: number,
    public childrenId?: number,
    public parentId?: number,
    public status?: string,
    public statusRef?: string,
  ) {}
}
