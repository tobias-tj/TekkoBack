export class ActivityDetails {
  constructor(
    public activityDetailId: number,
    public startActivityTime?: string,
    public expirationActivityTime?: string,
    public titleActivity?: string,
    public descriptionActivity?: string,
    public experienceActivity?: number,
  ) {}
}
